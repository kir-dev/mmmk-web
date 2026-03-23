/* eslint-disable max-lines */
import validDate from '@components/calendar/validDate';
import { useEffect, useMemo, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { showErrorToast } from '@/lib/errorToast';
import { submitReservation } from '@/lib/reservationSubmitter';
import { Band } from '@/types/band';
import { ClubMembership } from '@/types/member';
import { GateKeeperPriority, Reservation } from '@/types/reservation';
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
  // True while the gatekeeper user data is being fetched (prevents button flash — issue #65)
  const [gateKeeperLoading, setGateKeeperLoading] = useState(false);
  // Membership id bound to the reservation (what backend expects as gateKeeperId)
  const [gateKeeperMembershipId, setGateKeeperMembershipId] = useState<number | null>(null);
  // Priority for the gatekeeper
  const [gateKeeperPriority, setGateKeeperPriority] = useState<GateKeeperPriority | null>(null);

  const [gateKeepers, setGateKeepers] = useState<ClubMembership[]>([]);
  const [valid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const hasEditRights = useMemo(() => {
    // ADMINMADE reservations can only be edited by admins (issue #62)
    if (props.clickedEvent?.status === 'ADMINMADE' && me?.role !== 'ADMIN') return false;

    if (me?.role === 'ADMIN') return true;
    if (props.clickedEvent?.userId === me?.id) return true;

    // Check if user is a member of the band associated with this reservation
    if (band && band.members && me?.id) {
      const isUserInBand = band.members.some((member) => member.userId === me.id);
      if (isUserInBand) return true;
    }

    return false;
  }, [me, props.clickedEvent, band]);

  const getGateKeeper = (membershipId: number | null, priority?: GateKeeperPriority | null) => {
    setGateKeeperMembershipId(membershipId);
    setGateKeeperPriority(priority || null);
    if (membershipId) {
      setGateKeeperLoading(true);
      axiosApi
        .get(`/memberships/${membershipId}`)
        .then((res) => {
          axiosApi
            .get(`/users/${res.data.userId}`)
            .then((result) => {
              setGateKeeper(result.data);
            })
            .finally(() => {
              setGateKeeperLoading(false);
            });
        })
        .catch(() => {
          setGateKeeper(null);
          setGateKeeperLoading(false);
        });
    } else {
      setGateKeeper(null);
      setGateKeeperLoading(false);
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

  const onDelete = async () => {
    if (!props.clickedEvent) {
      console.error('No clicked event to delete');
      return;
    }

    const reservationStart = new Date(props.clickedEvent.startTime);
    // Only prevent non-admins from deleting past reservations
    if (reservationStart.getTime() < Date.now() && me?.role !== 'ADMIN') {
      showErrorToast(new Error('Nem törölhetsz múltbeli foglalást!'));
      return;
    }

    //if (!window.confirm('Biztosan törlöd a foglalást?')) return;

    try {
      //console.log('Deleting reservation with ID:', props.clickedEvent.id);
      await axiosApi.delete(`/reservations/${props.clickedEvent.id}`);
      //console.log('Reservation deleted successfully');

      // Close modal first to prevent any state issues
      props.setIsEventDetails(false);

      // Then refresh data
      props.onGetData();
    } catch (error: unknown) {
      console.error('Error deleting reservation:', error);
      showErrorToast(error);
    }
  };

  const onEdit = () => {
    if (!props.clickedEvent) return;
    if (isEditing) {
      if (validDate(editStartTimeValue, editEndTimeValue, props.clickedEvent, props.reservations)) {
        axiosApi
          .patch(`/reservations/${props.clickedEvent.id}`, {
            startTime: editStartTimeValue.toISOString(),
            endTime: editEndTimeValue.toISOString(),
            userId: props.clickedEvent.userId,
            bandId: props.clickedEvent.bandId,
          })
          .then(() => {
            props.onGetData();
            onGetName(props.clickedEvent?.id);
            setValid(true);
            setIsEditing(false);
          })
          .catch((err: unknown) => {
            showErrorToast(err);
            setValid(false);
            // Keep isEditing true so the user can correct and retry
          });
      } else {
        setValid(false);
        showErrorToast(new Error('Érvénytelen időtartam vagy ütközés egy másik foglalással.'));
      }
      return;
    }
    setIsEditing(true);
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

  function currentUserCanBeGateKeeper(): boolean {
    if (!me || !props.clickedEvent) return false;
    // User cannot be gatekeeper for their own reservation
    if (props.clickedEvent.userId === me.id) return false;
    // User cannot be gatekeeper for a band they're a member of
    if (band && band.members) {
      const isUserInBand = band.members.some((member) => member.userId === me.id);
      if (isUserInBand) return false;
    }
    return true;
  }

  const handleSubmitMail = (message: string, email: string, sender: string) => {
    fetch('/api/kir-mail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Marci',
        email: email,
        message: message,
        sender: sender,
      }),
    }).then((response) => {
      if (response.ok) {
        //alert('E-mail elküldve!');
      } else {
        //alert('Hiba történt az e-mail küldése közben!');
      }
    });
  };

  const onSetGK = async (priority: GateKeeperPriority | null) => {
    if (!props.clickedEvent) return;
    const myMembership = CurrentUserIsGK();
    if (!myMembership) return;

    // Collect email recipients
    let emailRecipients: string[] = [];

    if (props.clickedEvent.userId) {
      // Personal reservation - email the user
      await axiosApi.get(`/users/${props.clickedEvent.userId}`).then((res) => {
        emailRecipients = [res.data.email];
      });
    } else if (props.clickedEvent.bandId && band) {
      // Band reservation - email all band members
      if (band.members && band.members.length > 0) {
        const memberEmails = await Promise.all(
          band.members.map((member) => axiosApi.get(`/users/${member.userId}`).then((res) => res.data.email))
        );
        emailRecipients = memberEmails.filter(Boolean);
      }
    }

    // Unset if current user already assigned (membership id matches) and priority is null
    if (priority === null && gateKeeperMembershipId && gateKeeperMembershipId === myMembership.id) {
      axiosApi.patch(`/reservations/${props.clickedEvent.id}`, { gateKeeperId: null }).then(() => {
        setGateKeeper(null);
        setGateKeeperMembershipId(null);
        setGateKeeperPriority(null);
        props.onGetData();

        // Send email to all recipients
        if (emailRecipients.length > 0) {
          emailRecipients.forEach((email) => {
            handleSubmitMail('A beengedő visszamondta a foglalásod.', email, me!.email);
          });
        }
      });
      return;
    }

    // Set gatekeeper using membership id and priority
    if (priority) {
      axiosApi
        .patch(`/reservations/${props.clickedEvent.id}`, {
          gateKeeperId: myMembership.id,
          gateKeeperPriority: priority,
        })
        .then(() => {
          setGateKeeperMembershipId(myMembership.id);
          setGateKeeperPriority(priority);
          axiosApi.get(`/users/${myMembership.userId}`).then((resp) => {
            setGateKeeper(resp.data);

            // Send email to all recipients
            if (emailRecipients.length > 0) {
              const message = `A foglalásodhoz beengedő lett rendelve. Név: ${resp.data.fullName}, e-mail: ${resp.data.email}`;
              emailRecipients.forEach((email) => {
                handleSubmitMail(message, email, resp.data.email);
              });
            }
          });
          props.onGetData();
        })
        .catch((err: unknown) => {
          showErrorToast(err);
          setValid(false);
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
      getGateKeeper(props.clickedEvent.gateKeeperId || null, props.clickedEvent.gateKeeperPriority);
    } else {
      setGateKeeper(null);
      setGateKeeperMembershipId(null);
      setGateKeeperPriority(null);
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
      needToBeLetIn: props.clickedEvent?.needToBeLetIn,
    });
  };

  return {
    isEditing,
    editNameValue,
    setEditNameValue,
    editStartTimeValue,
    editEndTimeValue,
    setEditStartTimeValue,
    setEditEndTimeValue,
    user,
    band,
    gateKeeper,
    gateKeeperLoading,
    gateKeeperPriority,
    gateKeepers,
    valid,
    errorMessage,
    hasEditRights,
    CurrentUserIsGK,
    currentUserCanBeGateKeeper,
    onSetGK,
    onDelete,
    onEdit,
    handleCloseModal,
    setAsOvertime,
    requestNormalReservation,
    me,
  };
}
