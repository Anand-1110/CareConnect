import React, { useEffect } from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData, backendurl} = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  useEffect(()=>{
    if(dToken) {
      getProfileData()
    }

  },[dToken])

  return profileData && (
    <div>
      <div>
        <div>
          <img src={profileData.image} alt="" />
        </div>
        <div>
          {/*----Doc Info : name, degree, experience -----*/}
          <p>{profileData.name}</p>
          <div>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button>{profileData.experience}</button>
          </div>
          {/*----Doc About-----*/}
          <div>
            <p>About:</p>
            <p>
              {profileData.about}
            </p>
          </div>
          <p>
            Appointment Fee : <span>{currency} {profileData.fee}</span>
          </p>
          <div>
            <p>Address:</p>
            <p>{profileData.address.line1}</p>
            <p>{profileData.address.line2}</p>
          </div>
          <div>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Available</label>
          </div>
          <button>Edit</button>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile