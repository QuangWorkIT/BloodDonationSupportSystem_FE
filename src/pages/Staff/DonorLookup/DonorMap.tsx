import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VolunteerProps } from '@/pages/Staff/DonorLookup/DonorLookup';
import { Building, User } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface DonorMapProps {
    toggleSelectDonor: (donor: VolunteerProps) => void;
    volunteers: VolunteerProps[];
    selectedDonor: VolunteerProps[];
}

function DonorMap({ volunteers, selectedDonor, toggleSelectDonor }: DonorMapProps) {
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
    };
    
    const positions: VolunteerProps[] = [facility, ...volunteers];
    const mapKey = import.meta.env.VITE_GEOCODING_ID;

    const createIcon = (icon: React.ReactElement, className: string) => {
        return new L.DivIcon({
            html: ReactDOMServer.renderToString(
                <div className={`p-2 rounded-full shadow-lg cursor-pointer ${className}`}>
                    {icon}
                </div>
            ),
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });
    };

    const facilityIcon = createIcon(<Building className="w-5 h-5 text-white" />, 'bg-blue-500');
    const donorIcon = createIcon(<User className="w-5 h-5 text-white" />, 'bg-red-500');
    const selectedDonorIcon = createIcon(<User className="w-5 h-5 text-red-500" />, 'bg-white');

    return (
        <MapContainer
            center={[positions[0].latitude, positions[0].longitude]}
            zoom={15}
            maxZoom={20}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
        >
            <TileLayer
                attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>'
                url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${mapKey}`}
            />
            {positions.map((volunteer, index) => {
                const isFacility = index === 0;
                const isSelected = selectedDonor.some((d) => d.id === volunteer.id);

                    return (
                            <Marker
                        key={volunteer.id}
                                position={[volunteer.latitude, volunteer.longitude]}
                        icon={isFacility ? facilityIcon : isSelected ? selectedDonorIcon : donorIcon}
                                eventHandlers={{
                                    click: () => {
                                if (!isFacility) {
                                        toggleSelectDonor(volunteer);
                                    }
                            }
                                }}
                            >
                        <Tooltip>
                            <div className="font-semibold">{volunteer.fullName}</div>
                            {!isFacility && <div>{volunteer.bloodTypeName}</div>}
                                </Tooltip>
                            </Marker>
                );
            })}
        </MapContainer>
    );
}

export default DonorMap;
