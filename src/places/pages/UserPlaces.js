import React from 'react'
import { useParams } from 'react-router-dom'
import PlaceList from '../components/PlaceList'

const DUMMY_PLACES = [
    {
        id: "p1",
        title:"Empire State Building",
        description:"Empire state building is an legendry building",
        imageUrl:'https://media.timeout.com/images/101705309/image.jpg' ,
        address:'20 W 34th St, New York, NY 1001',
        location:{
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator:'u1'
    },
    {
        id: "p2",
        title:"Empire State Building",
        description:"Empire state building is an legendry building",
        imageUrl:'https://media.timeout.com/images/101705309/image.jpg' ,
        address:'20 W 34th St, New York, NY 1001',
        location:{
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator:'u2'
    }
]

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return (
    <PlaceList  items={loadedPlaces} />
  )
}

export default UserPlaces