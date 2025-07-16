import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VolunteerProps } from '@/pages/Staff/DonorLookup/DonorLookup'

interface DonorMapProps {
    toggleSelectDonor: (donor: VolunteerProps) => void
    volunteers: VolunteerProps[],
    selectedDonor: VolunteerProps[]
}

function DonorMap({ volunteers, selectedDonor, toggleSelectDonor }: DonorMapProps) {
    // lat - lon default position
    const facility = {
        id: 1,
        fullName: "Bệnh Viện Lê Văn Việt",
        bloodTypeName: "",
        phone: "",
        gmail: "",
        distance: 0,
        startVolunteerDate: new Date(),
        endVolunteerDate: new Date(),
        latitude: 10.844883750000001,
        longitude: 106.79020417554815
    }
    const positions: VolunteerProps[] = [facility, ...volunteers]
    const mapKey = import.meta.env.VITE_GEOCODING_ID
    const facilityIcon = new L.DivIcon({
        html: `<div class="animated-marker group ">
            <svg
            class="transition-transform duration-500 group-hover:animate-bounce group-active:scale-110" 
            width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0003 0.166687C18.112 0.166687 23.0837 5.12252 23.0837 11.25C23.0837 19.5625 12.0003 31.8334 12.0003 31.8334C12.0003 31.8334 0.916992 19.5625 0.916992 11.25C0.916992 8.31054 2.0847 5.49145 4.16323 3.41292C6.24175 1.33439 9.06084 0.166687 12.0003 0.166687ZM7.25033 6.50002V16H10.417V12.8334H13.5837V16H16.7503V6.50002H13.5837V9.66669H10.417V6.50002H7.25033Z" fill="#F07275"/>
            </svg>
           </div>`,
        className: '', // Avoid default Leaflet styling
        iconAnchor: [20, 38],
        popupAnchor: [-7, -38],
        tooltipAnchor: [0, -34]
    })

    const donorIcon = new L.DivIcon({
        html: `<div class="animated-marker group ">
            <svg 
            class="transition-transform duration-500 group-hover:animate-bounce group-active:scale-110" 
            width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0003 0.166687C5.88866 0.166687 0.916992 5.13835 0.916992 11.25C0.916992 19.5625 12.0003 31.8334 12.0003 31.8334C12.0003 31.8334 23.0837 19.5625 23.0837 11.25C23.0837 5.13835 18.112 0.166687 12.0003 0.166687ZM12.0003 3.33335C12.4163 3.33325 12.8282 3.41508 13.2125 3.57416C13.5969 3.73324 13.9461 3.96647 14.2403 4.26052C14.5345 4.55457 14.7679 4.90369 14.9272 5.28795C15.0864 5.6722 15.1685 6.08406 15.1686 6.50002C15.1687 6.91598 15.0869 7.32788 14.9278 7.71221C14.7687 8.09655 14.5355 8.44578 14.2414 8.73998C13.9474 9.03418 13.5982 9.26758 13.214 9.42686C12.8297 9.58613 12.4179 9.66817 12.0019 9.66827C11.1618 9.66848 10.3561 9.33497 9.76195 8.7411C9.16778 8.14724 8.83387 7.34167 8.83366 6.5016C8.83345 5.66154 9.16696 4.8558 9.76083 4.26164C10.3547 3.66748 11.1603 3.33356 12.0003 3.33335ZM12.0003 19.1667C9.35616 19.1667 7.02866 17.8209 5.66699 15.7625C5.66699 13.6725 9.89449 12.5167 12.0003 12.5167C14.1062 12.5167 18.3337 13.6725 18.3337 15.7625C17.6431 16.8106 16.7026 17.6705 15.5971 18.2647C14.4915 18.859 13.2555 19.1689 12.0003 19.1667Z" fill="#4F81E5"/>
            </svg>
           </div>`,
        className: '', // Avoid default Leaflet styling
        iconAnchor: [20, 38],
        popupAnchor: [-7, -38],
        tooltipAnchor: [0, -34]
    })

    const selectedDonorIcon = new L.DivIcon({
        html: `<div class="animated-marker group ">
            <svg
            class="transition-transform duration-500 group-hover:animate-bounce group-active:scale-110" 
            width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0003 0.166687C5.88866 0.166687 0.916992 5.13835 0.916992 11.25C0.916992 19.5625 12.0003 31.8334 12.0003 31.8334C12.0003 31.8334 23.0837 19.5625 23.0837 11.25C23.0837 5.13835 18.112 0.166687 12.0003 0.166687ZM12.0003 3.33335C12.4163 3.33325 12.8282 3.41508 13.2125 3.57416C13.5969 3.73324 13.9461 3.96647 14.2403 4.26052C14.5345 4.55457 14.7679 4.90369 14.9272 5.28795C15.0864 5.6722 15.1685 6.08406 15.1686 6.50002C15.1687 6.91598 15.0869 7.32788 14.9278 7.71221C14.7687 8.09655 14.5355 8.44578 14.2414 8.73998C13.9474 9.03418 13.5982 9.26758 13.214 9.42686C12.8297 9.58613 12.4179 9.66817 12.0019 9.66827C11.1618 9.66848 10.3561 9.33497 9.76195 8.7411C9.16778 8.14724 8.83387 7.34167 8.83366 6.5016C8.83345 5.66154 9.16696 4.8558 9.76083 4.26164C10.3547 3.66748 11.1603 3.33356 12.0003 3.33335ZM12.0003 19.1667C9.35616 19.1667 7.02866 17.8209 5.66699 15.7625C5.66699 13.6725 9.89449 12.5167 12.0003 12.5167C14.1062 12.5167 18.3337 13.6725 18.3337 15.7625C17.6431 16.8106 16.7026 17.6705 15.5971 18.2647C14.4915 18.859 13.2555 19.1689 12.0003 19.1667Z" fill="#56BA28"/>
            </svg>
           </div>`,
        className: '', // Avoid default Leaflet styling
        iconAnchor: [20, 38],
        popupAnchor: [-7, -38],
        tooltipAnchor: [0, -34]
    })
    return (
        <MapContainer
            center={[positions[0].latitude, positions[0].longitude]}
            zoom={17}
            maxZoom={20}
            scrollWheelZoom={true}
            className="w-full h-full rounded-lg shadow-md border-2 border-gray-200 z-0">
            <TileLayer
                attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>'
                url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapKey}`}
            />
            {
                positions.map((volunteer, index) => {
                    return (
                        index === 0 ? (
                            <Marker
                                key={index + volunteer.id}
                                position={[volunteer.latitude, volunteer.longitude]}
                                icon={facilityIcon}
                            >
                                <Popup>
                                    <p><span className="text-[#7D7D7F]"></span> {volunteer.fullName}</p>
                                </Popup>
                                <Tooltip>
                                    <p><span className="text-[#7D7D7F]"></span> {volunteer.fullName}</p>
                                </Tooltip>
                            </Marker>) : (
                            <Marker
                                key={index + volunteer.id}
                                position={[volunteer.latitude, volunteer.longitude]}
                                icon={selectedDonor.some((selected) => selected.id === volunteer.id) ? selectedDonorIcon : donorIcon}
                                eventHandlers={{
                                    click: () => {
                                        toggleSelectDonor(volunteer);
                                    }
                                }}
                            >
                                <Tooltip
                                    className='w-[230px] h-[100px] flex flex-col justify-center items-center rounded-lg'
                                >
                                    <div className="">
                                        <p className='text-[14px]'><span className="text-[#7D7D7F]">Tên:</span> {volunteer.fullName}</p>
                                        <p className='text-[14px]'><span className="text-[#7D7D7F]">Loại máu:</span> {volunteer.bloodTypeName}</p>
                                        <p className='text-[14px]'><span className="text-[#7D7D7F]">Số điện thoại:</span> {volunteer.phone}</p>
                                        <p className='text-[14px]'><span className="text-[#7D7D7F]">Gmail: </span>{volunteer.gmail}</p>
                                    </div>
                                </Tooltip>
                            </Marker>
                        )
                    )
                })
            }
        </MapContainer>
    )
}

export default DonorMap
