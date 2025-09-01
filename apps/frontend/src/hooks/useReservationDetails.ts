// hooks/useReservationDetails.ts
import { start } from 'node:repl';

import IsOvertime, { getReservationsOfDay, getReservationsOfWeek } from '@components/calendar/isReservationOvertime';
import validDate from '@components/calendar/validDate';
import axios from 'axios';
import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { submitReservation } from '@/lib/reservationSubmitter';
import { Band } from '@/types/band';
import { ClubMembership } from '@/types/member';
import { Reservation } from '@/types/reservation';
import { User } from '@/types/user';

const url = 'http://localhost:3030/reservations';

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

  const [me, setMe] = useState<User>();
  const [gateKeeper, setGateKeeper] = useState<User | null>(null);

  const [gateKeepers, setGateKeepers] = useState<ClubMembership[]>([]);
  const [valid, setValid] = useState(true);

  const [hasEditRights, setHasEditRights] = useState(false);

  const getMe = () => {
    axiosApi.get('http://localhost:3030/users/me').then((res) => {
      setMe(res.data);
      console.log(`${props.clickedEvent?.userId} ${me?.id} ${res.data.id}`);
      if (res.data.role === 'ADMIN' || props.clickedEvent?.userId === res.data.id) {
        setHasEditRights(true);
      } else {
        setHasEditRights(false);
      }
    });
  };

  const getGateKeeper = (id: number | null) => {
    if (id) {
      axios
        .get(`http://localhost:3030/memberships/${id}`)
        .then((res) => {
          axios.get(`http://localhost:3030/users/${res.data.userId}`).then((result) => {
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
    axios.get(`http://localhost:3030/users/${id}`).then((res) => {
      setUser(res.data);
      // Remove this line: setEditNameValue(res.data.name);
    });
  };

  // In useReservationDetails.ts, modify the getBand function:

  const getBand = (id: number) => {
    axios
      .get(`http://localhost:3030/bands/${id}`)
      .then((res) => {
        if (res.data) {
          setBand(res.data);
          if (res.data.name) {
            setEditNameValue(res.data.name);
          } else {
            console.error("Band data doesn't contain name property:", res.data);
          }
        } else {
          console.error('Empty response when fetching band');
        }
      })
      .catch((error) => {
        console.error('Error fetching band data:', error);
      });
  };

  const onDelete = () => {
    if (new Date(props.clickedEvent!.startTime).getTime() < new Date().getTime()) {
      alert('Nem törölhető a múltbeli foglalás!');
      return;
    }
    const confirmDelete = window.confirm('Biztosan törlöd a foglalást?');
    if (confirmDelete && props.clickedEvent?.id) {
      return axios.delete(`${url}/${props.clickedEvent?.id}`).then(() => {
        props.onGetData();
        props.setIsEventDetails(!props.isEventDetails);
      });
    }
  };

  const onEdit = () => {
    if (isEditing) {
      if (validDate(editStartTimeValue, editEndTimeValue, props.clickedEvent, props.reservations)) {
        axios
          .patch(`${url}/${props.clickedEvent?.id}`, {
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
    setIsEditing(!isEditing);
  };

  const onGetName = (id: number | undefined) => {
    if (!id) return;
    axios.get(`${url}/${id}`).then((res) => {
      props.setClickedEvent(res.data);
    });
  };

  const getGKs = () => {
    axiosApi.get('http://localhost:3030/memberships').then((res) => {
      setGateKeepers(res.data);
    });
  };

  function CurrentUserIsGK() {
    let isUserGK: ClubMembership | null = null;
    for (let i = 0; i < gateKeepers.length; i++) {
      if (gateKeepers[i].userId === me?.id) {
        isUserGK = gateKeepers[i];
        return isUserGK;
      }
    }
    return null;
  }

  const onSetGK = () => {
    const isUserGK = CurrentUserIsGK();

    if (gateKeeper) {
      axiosApi
        .patch(`${url}/${props.clickedEvent?.id}`, {
          gateKeeperId: null,
        })
        .then(() => {
          setGateKeeper(null);
          props.onGetData();
        });
    }

    if (isUserGK && gateKeeper === null) {
      axiosApi
        .patch(`${url}/${props.clickedEvent?.id}`, {
          gateKeeperId: isUserGK.id,
        })
        .then(() => {
          axiosApi.get(`http://localhost:3030/users/${isUserGK.userId}`).then((resp) => {
            setGateKeeper(resp.data);
          });
          props.onGetData();
        });
    }
  };

  useEffect(() => {
    // Reset states when a new event is clicked
    if (props.clickedEvent) {
      setEditStartTimeValue(new Date(props.clickedEvent.startTime) || new Date());
      setEditEndTimeValue(new Date(props.clickedEvent.endTime) || new Date());
      // Reset band and name states
      setBand(undefined);
      setEditNameValue('');
    }

    if (props.clickedEvent?.userId) getUser(props.clickedEvent.userId);
    if (props.clickedEvent?.bandId) getBand(props.clickedEvent.bandId);
    getGateKeeper(props.clickedEvent?.gateKeeperId || null);
    getMe();
    getGKs();
  }, [props.clickedEvent?.id]);

  const handleCloseModal = () => {
    props.setIsEventDetails(!props.isEventDetails);
    setIsEditing(false);
    setValid(true);
  };

  const setAsOvertime = () => {
    axiosApi
      .patch(`${url}/${props.clickedEvent?.id}`, {
        status: 'OVERTIME',
      })
      .then(() => {
        props.onGetData();
        props.setIsEventDetails(!props.isEventDetails);
      });
  };

  const requestNormalReservation = () => {
    if (!props.clickedEvent) return;

    const start = new Date(new Date(props.clickedEvent.startTime).getTime() + 60 * 60 * 1000);
    const end = new Date(new Date(props.clickedEvent.endTime).getTime() + 60 * 60 * 1000);

    submitReservation({
      user: user,
      band: band,
      startTime: start,
      endTime: end,
      myUser: me,
      reservations: props.reservations,
      onSuccess: () => {
        props.onGetData();
        props.setIsEventDetails(!props.isEventDetails);
      },
      setValid: (valid: boolean) => {},
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
