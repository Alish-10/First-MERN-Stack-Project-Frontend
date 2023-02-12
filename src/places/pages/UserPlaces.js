import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../../shared/components/Api'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/HttpHook'
import PlaceList from '../components/PlaceList'


const UserPlaces = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    const userId = useParams().userId;


    useEffect(() => {
        const fetchPlces = async () => {
            try {
                const response = await sendRequest(API_URL + `/places/user/${userId}`)
                setLoadedPlaces(response.userWithPlaces)
            } catch (error) {

            }
        }
        fetchPlces();
    }, [sendRequest, userId]);
    const placeDeleteHandler = deletedPlaceId => {
        setLoadedPlaces(
            prevPlaces => prevPlaces.filter(
                place => place.id !== deletedPlaceId
            )
        )
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading &&
                <div className='center'>
                    <LoadingSpinner asOverlay />

                </div>}
            {!isLoading && loadedPlaces &&
                <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />

            }
        </>
    )
}

export default UserPlaces;