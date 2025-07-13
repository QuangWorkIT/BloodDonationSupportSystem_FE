import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { VolunteerProps } from '@/pages/Staff/DonorLookup/DonorLookup'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
interface DonorMapProps {
    volunteers: VolunteerProps[]
}

function ForceResizeMap() {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize(); // Force Leaflet to re-render map layout
        }, 300);
    }, [map]);

    return null;
}
function DonorMap({ volunteers }: DonorMapProps) {
    // lat - lon default position
    const position: [number, number] = [10.844883750000001, 106.79020417554815]
    const mapKey = import.meta.env.VITE_GEOCODING_ID
    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full rounded-lg shadow-md">
            <ForceResizeMap />
            <TileLayer
                attribution='<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
                url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapKey}`}
            />
            {
                volunteers.map((volunteer, index) => {
                    return (
                        <Marker
                            key={index + volunteer.id}
                            position={[volunteer.lat, volunteer.lon]}
                        >
                            <Popup>
                                <p><span className="text-[#7D7D7F]">Tên:</span> {volunteer.fullName}</p>
                                <p><span className="text-[#7D7D7F]">Loại máu:</span> {volunteer.bloodTypeName}</p>
                                <p><span className="text-[#7D7D7F]">Số điện thoại:</span> {volunteer.phone}</p>
                                <p><span className="text-[#7D7D7F]">Gmail: </span>{volunteer.gmail}</p>
                            </Popup>
                        </Marker>
                    )
                })
            }
        </MapContainer>
    )
}

export default DonorMap
