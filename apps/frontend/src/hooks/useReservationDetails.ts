import validDate from '@components/calendar/validDate';
import { useEffect, useMemo, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { submitReservation } from '@/lib/reservationSubmitter';
import { Band } from '@/types/band';
import { ClubMembership } from '@/types/member';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

import { useUser } from './useUser';

interface ReservationDetailsProps {
  isEventDetails: boolean;
  setIsEventDetails: (value: boolean) => void;
  clickedEvent: Reservation | undefined;
  setClickedEvent: (reservation: Reservation) => void;
  onGetData: () => void;
  reservations: Reservation[];
}

export function useReservationDetails(props: ReservationDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [editStartTimeValue, setEditStartTimeValue] = useState(new Date());
  const [editEndTimeValue, setEditEndTimeValue] = useState(new Date());

  const [user, setUser] = useState<User>();
  const [band, setBand] = useState<Band>();

  const { user: me, refetch: refetchUser } = useUser();

  // User who is the gatekeeper
  const [gateKeeper, setGateKeeper] = useState<User | null>(null);
  // Membership id bound to the reservation (what backend expects as gateKeeperId)
  const [gateKeeperMembershipId, setGateKeeperMembershipId] = useState<number | null>(null);

  const [gateKeepers, setGateKeepers] = useState<ClubMembership[]>([]);
  const [valid, setValid] = useState(true);

  const hasEditRights = useMemo(() => {
    return me?.role === 'ADMIN' || props.clickedEvent?.userId === me?.id;
  }, [me, props.clickedEvent]);

  const getGateKeeper = (membershipId: number | null) => {
    setGateKeeperMembershipId(membershipId);
    if (membershipId) {
      axiosApi
        .get(`/memberships/${membershipId}`)
        .then((res) => {
          axiosApi.get(`/users/${res.data.userId}`).then((result) => {
            setGateKeeper(result.data);
          });
        })
        .catch(() => {
          setGateKeeper(null);
        });
    } else {
      setGateKeeper(null);
    }
  };

  const getUser = (id: number) => {
    axiosApi.get(`/users/${id}`).then((res) => setUser(res.data));
  };

  const getBand = (id: number) => {
    axiosApi
      .get(`/bands/${id}`)
      .then((res) => {
        if (res.data) {
          setBand(res.data);
          if (res.data.name) setEditNameValue(res.data.name);
        }
      })
      .catch(() => {});
  };

  const onDelete = () => {
    if (!props.clickedEvent) return;
    if (new Date(props.clickedEvent.startTime).getTime() < Date.now()) return;
    //if (!window.confirm('Biztosan törlöd a foglalást?')) return;
    axiosApi.delete(`/reservations/${props.clickedEvent.id}`).then(() => {
      props.onGetData();
      props.setIsEventDetails(!props.isEventDetails);
    });
  };

  const onEdit = () => {
    if (!props.clickedEvent) return;
    if (isEditing) {
      if (validDate(editStartTimeValue, editEndTimeValue, props.clickedEvent, props.reservations)) {
        axiosApi
          .patch(`/reservations/${props.clickedEvent.id}`, {
            startTime: editStartTimeValue.toISOString(),
            endTime: editEndTimeValue.toISOString(),
          })
          .then(() => {
            props.onGetData();
            onGetName(props.clickedEvent?.id);
          });
        setValid(true);
      } else {
        setValid(false);
      }
    }
    setIsEditing((p) => !p);
  };

  const onGetName = (id: number | undefined) => {
    if (!id) return;
    axiosApi.get(`/reservations/${id}`).then((res) => {
      props.setClickedEvent(res.data);
    });
  };

  const getGKs = () => {
    axiosApi.get('/memberships').then((res) => setGateKeepers(res.data));
  };

  function CurrentUserIsGK(): ClubMembership | null {
    return gateKeepers.find((m) => m.userId === me?.id) || null;
  }

  const handleSubmitMail = (message: string) => {
    fetch('/api/kir-mail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Marci',
        email: 'marciemail7@gmail.com',
        message: message,
      }),
    }).then((response) => {
      if (response.ok) {
        //alert('E-mail elküldve!');
      } else {
        //alert('Hiba történt az e-mail küldése közben!');
      }
    });
  };

  const onSetGK = () => {
    if (!props.clickedEvent) return;
    const myMembership = CurrentUserIsGK();
    if (!myMembership) return;

    // Unset if current user already assigned (membership id matches)
    if (gateKeeperMembershipId && gateKeeperMembershipId === myMembership.id) {
      axiosApi.patch(`/reservations/${props.clickedEvent.id}`, { gateKeeperId: null }).then(() => {
        setGateKeeper(null);
        setGateKeeperMembershipId(null);
        props.onGetData();
        handleSubmitMail('A beengedő visszamondta a foglalásod.');
      });
      return;
    }

    // Set gatekeeper using membership id \*NOT\* user id
    if (!gateKeeperMembershipId) {
      axiosApi.patch(`/reservations/${props.clickedEvent.id}`, { gateKeeperId: myMembership.id }).then(() => {
        setGateKeeperMembershipId(myMembership.id);
        axiosApi.get(`/users/${myMembership.userId}`).then((resp) => {
          setGateKeeper(resp.data);
          handleSubmitMail(
            `A foglalásodhoz beengedő lett rendelve. Név: ${resp.data.fullName}, e-mail: ${resp.data.email}`
          );
        });
        props.onGetData();
      });
    }
  };

  useEffect(() => {
    if (props.clickedEvent) {
      setEditStartTimeValue(new Date(props.clickedEvent.startTime));
      setEditEndTimeValue(new Date(props.clickedEvent.endTime));
      setBand(undefined);
      setEditNameValue('');
      if (props.clickedEvent.userId) getUser(props.clickedEvent.userId);
      if (props.clickedEvent.bandId) getBand(props.clickedEvent.bandId);
      getGateKeeper(props.clickedEvent.gateKeeperId || null);
    } else {
      setGateKeeper(null);
      setGateKeeperMembershipId(null);
    }
    refetchUser();
    getGKs();
  }, [props.clickedEvent?.id]);

  const handleCloseModal = () => {
    props.setIsEventDetails(!props.isEventDetails);
    setIsEditing(false);
    setValid(true);
  };

  const setAsOvertime = () => {
    if (!props.clickedEvent) return;
    const today = new Date().getDate();
    if (
      new Date(props.clickedEvent.startTime).getDate() < today ||
      (new Date(props.clickedEvent.startTime).getHours() < new Date().getHours() &&
        new Date(props.clickedEvent.startTime).getDate() === today) ||
      (new Date(props.clickedEvent.startTime).getHours() === new Date().getHours() &&
        new Date(props.clickedEvent.startTime).getMinutes() <= new Date().getMinutes() &&
        new Date(props.clickedEvent.startTime).getDate() === today)
    )
      return;
    axiosApi.patch(`/reservations/${props.clickedEvent.id}`, { status: 'OVERTIME' }).then(() => {
      props.onGetData();
      props.setIsEventDetails(!props.isEventDetails);
    });
  };

  const requestNormalReservation = () => {
    if (!props.clickedEvent || !me) return;
    const start = new Date(new Date(props.clickedEvent.startTime).getTime() + 60 * 60 * 1000);
    const end = new Date(new Date(props.clickedEvent.endTime).getTime() + 60 * 60 * 1000);
    submitReservation({
      user,
      band,
      startTime: start,
      endTime: end,
      myUser: me,
      reservations: props.reservations,
      onSuccess: () => {
        props.onGetData();
        props.setIsEventDetails(!props.isEventDetails);
      },
      setValid: () => {},
      adminOverride: false,
    });
  };

  return {
    isEditing,
    editNameValue,
    setEditNameValue,
    setEditStartTimeValue,
    setEditEndTimeValue,
    user,
    band,
    gateKeeper,
    valid,
    hasEditRights,
    CurrentUserIsGK,
    onSetGK,
    onDelete,
    onEdit,
    handleCloseModal,
    setAsOvertime,
    requestNormalReservation,
  };
}
