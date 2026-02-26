import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Rider } from '../types';
import { mockRiders } from '../mockData';
import {
    Search, Bike, MoreVertical, Edit, Star, Phone, User, Filter, LayoutGrid, List,
    Trash2, Calendar, MapPin, CreditCard,
    TrendingUp, Clock, DollarSign, Award, Plus, X, Shield, Truck,
    Hash, Image as ImageIcon, UploadCloud, ChevronDown, ChevronUp
} from 'lucide-react';
import { Badge, Title, ActionIcon, Avatar } from 'rizzui';
import { ReusableModal } from '../../../../components/ReusableModal';
import { DropdownMenu } from '../../../../components/dropdown';
import Tabs from '../../../../components/Tabs';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import bikeAnimation from '../../../../components/delivery man bike fast.json';
import ContactRiderModal from './ContactRiderModal';

declare global {
    interface Window {
        google: any;
    }
}

interface RiderManagementViewProps {
    isDarkMode?: boolean;
    initialRiderId?: string | null;
    onConsumeInitialRiderId?: () => void;
}


export const RiderManagementView: React.FC<RiderManagementViewProps> = ({ isDarkMode = false, initialRiderId, onConsumeInitialRiderId }) => {

    // State
    const [riders, setRiders] = useState<Rider[]>(mockRiders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'busy'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [expandedRiderId, setExpandedRiderId] = useState<string | null>(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedRiderForMap, setSelectedRiderForMap] = useState<Rider | null>(null);

    // Google Maps state
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [map, setMap] = useState<any>(null);
    const [mapKey, setMapKey] = useState(0);
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<any>(null);

    const handleUpdateTaskStatus = (riderId: string, newStatus: 'pending' | 'received') => {
        setRiders(prev => prev.map(rider => {
            if (rider.id === riderId && rider.activeTask) {
                return {
                    ...rider,
                    activeTask: {
                        ...rider.activeTask,
                        paymentStatus: newStatus
                    }
                };
            }
            return rider;
        }));
    };

    const toggleRiderExpansion = (riderId: string) => {
        setExpandedRiderId(expandedRiderId === riderId ? null : riderId);
    };

    // Handle initial rider detail view
    const [activeTab, setActiveTab] = useState<'profile' | 'performance' | 'earnings'>('profile');

    // Filtered Data
    const filteredRiders = useMemo(() => {
        return riders.filter(rider => {
            const matchesSearch =
                rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rider.phone.includes(searchQuery) ||
                rider.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || rider.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, riders]);

    // Statistics
    const stats = useMemo(() => ({
        all: riders.length,
        available: riders.filter(r => r.status === 'available').length,
        busy: riders.filter(r => r.status === 'busy').length,
    }), [riders]);

    // Handlers


    const handleOpenMap = (rider: Rider) => {
        setSelectedRiderForMap(rider);
        setIsMapModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-success';
            case 'busy': return 'bg-primary';
            default: return 'bg-textSecondary/50';
        }
    };

    // Load Google Maps Script
    useEffect(() => {
        if (!isMapModalOpen) return;

        const loadGoogleMapsScript = () => {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

            if (!apiKey) {
                console.error('❌ Google Maps API key is missing');
                toast.error('Google Maps API key not configured');
                return;
            }

            if (window.google && window.google.maps) {
                console.log('✅ Google Maps already loaded');
                setIsMapLoaded(true);
                return;
            }

            if (document.querySelector('script[src*="maps.googleapis.com"]')) {
                console.log('⏳ Google Maps script already loading...');
                const checkInterval = setInterval(() => {
                    if (window.google && window.google.maps) {
                        console.log('✅ Google Maps loaded (interval check)');
                        setIsMapLoaded(true);
                        clearInterval(checkInterval);
                    }
                }, 100);
                return;
            }

            console.log('🔄 Loading Google Maps script...');
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                console.log('✅ Google Maps script loaded successfully');
                setIsMapLoaded(true);
            };

            script.onerror = (error) => {
                console.error('❌ Error loading Google Maps script:', error);
                toast.error('Failed to load Google Maps');
            };

            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
    }, [isMapModalOpen]);

    // Initialize Google Maps
    useEffect(() => {
        if (!isMapModalOpen || !mapRef.current || !isMapLoaded || !selectedRiderForMap?.currentLocation) return;

        const initMap = () => {
            try {
                console.log('🗺️ Initializing Google Maps for rider:', selectedRiderForMap.name);

                const riderLocation = {
                    lat: selectedRiderForMap.currentLocation!.lat,
                    lng: selectedRiderForMap.currentLocation!.lng
                };

                const mapInstance = new window.google.maps.Map(mapRef.current, {
                    center: riderLocation,
                    zoom: 15,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    zoomControl: true,
                    styles: isDarkMode ? [
                        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] }
                    ] : []
                });

                // Create custom marker icon
                const bikeIcon = {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" fill="#0066FF" stroke="white" stroke-width="2"/>
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="white" stroke-width="2"/>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 16),
                };
                // Add marker
                const marker = new window.google.maps.Marker({
                    position: riderLocation,
                    map: mapInstance,
                    icon: bikeIcon,
                    title: selectedRiderForMap.name,
                    animation: window.google.maps.Animation.DROP
                });

                markerRef.current = marker;
                setMap(mapInstance);

                console.log('✅ Map initialized successfully');
                toast.success(`Tracking ${selectedRiderForMap.name}`);
            } catch (error) {
                console.error('❌ Error initializing map:', error);
                toast.error('Failed to initialize map');
            }
        };

        initMap();
    }, [isMapModalOpen, isMapLoaded, selectedRiderForMap, isDarkMode, mapKey]);

    // Cleanup on modal close
    useEffect(() => {
        if (!isMapModalOpen) {
            if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
            }
            setMap(null);
            setMapKey(prev => prev + 1);
        }
    }, [isMapModalOpen]);

    const GridView = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
            {filteredRiders.map(rider => (
                <div
                    key={rider.id}
                    className="p-4 rounded-xl border border-border transition-all hover:shadow-md bg-surface flex flex-col h-full"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar src={rider.avatar} name={rider.name} className="w-12 h-12 rounded-lg object-cover ring-2 ring-primary/5 shadow-sm" />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${getStatusColor(rider.status)}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-textPrimary leading-none mb-1">{rider.name}</h3>
                                <div className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">
                                    {rider.id}
                                </div>
                            </div>
                        </div>
                        <Badge variant="flat" className={`rounded-full uppercase text-[9px] font-bold tracking-widest px-2 py-0.5 ${rider.status === 'available' ? 'bg-success/10 text-success' :
                            rider.status === 'busy' ? 'bg-primary/10 text-primary' :
                                'bg-textSecondary/10 text-textSecondary'
                            }`}>
                            {rider.status}
                        </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="text-xs flex items-center font-semibold text-textSecondary">
                            <Phone size={12} className="mr-2 text-primary/60" />
                            {rider.phone}
                        </div>
                        <div className="text-xs flex items-center font-medium text-textSecondary opacity-80">
                            <MapPin size={12} className="mr-2 text-primary/60" />
                            {rider.cityArea}
                        </div>
                    </div>

                    {/* Active Task Section - Grid View */}
                    <div className="flex-1">
                        {rider.status === 'busy' && rider.activeTask ? (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRiderExpansion(rider.id);
                                }}
                                className={`mb-4 p-3 rounded-xl border cursor-pointer transition-all duration-300 bg-primary/5 border-primary/20 ${expandedRiderId === rider.id ? 'ring-1 ring-primary/30' : 'hover:border-primary/20'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-primary opacity-70">Active Task</span>
                                        {expandedRiderId === rider.id ? <ChevronUp size={10} className="text-primary" /> : <ChevronDown size={10} className="text-primary" />}
                                    </div>
                                    <DropdownMenu
                                        isDarkMode={isDarkMode}
                                        trigger={
                                            <Badge size="sm" variant="flat" className={`cursor-pointer transition-all hover:opacity-80 flex items-center gap-1 px-2 py-0.5 rounded-full ${rider.activeTask.paymentStatus === 'received' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                <span className="text-[8px] font-bold">{rider.activeTask.paymentStatus.toUpperCase()}</span>
                                                <ChevronDown size={8} />
                                            </Badge>
                                        }
                                        items={[
                                            { label: 'PENDING', onClick: () => handleUpdateTaskStatus(rider.id, 'pending'), disabled: rider.activeTask.paymentStatus === 'pending' },
                                            { label: 'RECEIVED', onClick: () => handleUpdateTaskStatus(rider.id, 'received'), disabled: rider.activeTask.paymentStatus === 'received' },
                                        ]}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-textPrimary">{rider.activeTask.orderNumber}</span>
                                        <span className="text-[9px] font-medium text-textSecondary opacity-60">{rider.activeTask.itemsCount} Items</span>
                                    </div>
                                    <span className="text-xs font-black text-primary">PKR {rider.activeTask.totalAmount.toLocaleString()}</span>
                                </div>

                                {/* Expanded Items List in Grid */}
                                {expandedRiderId === rider.id && rider.activeTask.items && (
                                    <div className="mt-3 pt-3 border-t border-primary/10 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                        <div className="grid grid-cols-10 gap-1 text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">
                                            <div className="col-span-6 text-primary">Item Name</div>
                                            <div className="col-span-1 text-center text-primary">Qty</div>
                                            <div className="col-span-3 text-right text-primary">Price</div>
                                        </div>
                                        {rider.activeTask.items.map((item, idx) => (
                                            <div key={idx} className="grid grid-cols-10 gap-1 text-[10px] items-center">
                                                <div className="col-span-6 font-bold truncate text-textPrimary">{item.product.name}</div>
                                                <div className="col-span-1 text-center font-black text-textPrimary">{item.quantity}</div>
                                                <div className="col-span-3 text-right font-black text-primary">PKR {item.product.price.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mb-4 p-3 rounded-xl border border-dashed border-border flex items-center justify-center opacity-40">
                                <span className="text-[10px] font-bold uppercase tracking-widest  text-textSecondary">Waiting for Task</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => handleOpenMap(rider)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/10 bg-primary/5 text-[10px] font-bold uppercase tracking-wider transition-all text-primary hover:bg-primary/10"
                        >
                            <MapPin size={14} />
                            Track Location
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold opacity-30 text-textSecondary">Today</span>
                            <span className="text-xs font-bold text-primary">{rider.performance.completedToday} Orders</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] uppercase font-bold opacity-30 text-textSecondary">Earnings</span>
                            <span className="text-xs font-bold text-primary">PKR {rider.earnings.netPayable}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const ListView = (
        <div className="rounded-xl border border-border mt-6 bg-surface">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-background/30 border-b border-border">
                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-textSecondary font-bold">Rider Info</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-textSecondary font-bold">Orders</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-textSecondary font-bold">Location Info</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-textSecondary font-bold">Active Tasks</th>
                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-textSecondary font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                        {filteredRiders.map(rider => (
                            <tr key={rider.id} className="group hover:bg-surface/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar src={rider.avatar} name={rider.name} className="w-10 h-10 rounded-lg object-cover" />
                                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${getStatusColor(rider.status)}`} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-textPrimary leading-none mb-1">{rider.name}</div>
                                            <div className="text-[10px] font-medium text-textSecondary opacity-60 uppercase">{rider.id} • {rider.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge size="sm" variant="flat" className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                        {rider.performance.completedToday} Orders Today
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex flex-col min-w-0">
                                            <div className="text-[11px] font-bold text-textPrimary truncate mb-0.5">
                                                {rider.cityArea}
                                            </div>
                                            <div className="text-[10px] font-medium text-textSecondary opacity-70 truncate max-w-[150px]">
                                                {rider.activeTask?.customerAddress || 'Standby'}
                                            </div>
                                        </div>
                                        <ActionIcon
                                            variant="flat"
                                            size="sm"
                                            onClick={() => handleOpenMap(rider)}
                                            className="rounded-lg bg-primary/10 text-primary hover:bg-primary/20 shrink-0"
                                        >
                                            <MapPin size={14} />
                                        </ActionIcon>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {rider.status === 'busy' && rider.activeTask ? (
                                        <div
                                            className="flex flex-col cursor-pointer hover:bg-primary/5 p-2 rounded-lg transition-all"
                                            onClick={() => toggleRiderExpansion(rider.id)}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-textPrimary">{rider.activeTask.orderNumber}</span>
                                                <DropdownMenu
                                                    isDarkMode={isDarkMode}
                                                    trigger={
                                                        <Badge size="sm" variant="flat" className={`cursor-pointer transition-all hover:opacity-80 flex items-center gap-1 px-2 py-0.5 rounded-full ${rider.activeTask.paymentStatus === 'received' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                            <span className="text-[8px] font-bold">{rider.activeTask.paymentStatus.toUpperCase()}</span>
                                                            <ChevronDown size={8} />
                                                        </Badge>
                                                    }
                                                    items={[
                                                        { label: 'PENDING', onClick: () => handleUpdateTaskStatus(rider.id, 'pending'), disabled: rider.activeTask.paymentStatus === 'pending' },
                                                        { label: 'RECEIVED', onClick: () => handleUpdateTaskStatus(rider.id, 'received'), disabled: rider.activeTask.paymentStatus === 'received' },
                                                    ]}
                                                />
                                                {expandedRiderId === rider.id ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />}
                                            </div>

                                            {/* Itemized List - Refined for better visibility */}
                                            <div className="flex flex-col gap-1.5 mt-2">
                                                {(expandedRiderId === rider.id ? rider.activeTask.items : rider.activeTask.items?.slice(0, 1))?.map((item, idx) => (
                                                    <div key={idx} className="grid grid-cols-5 gap-2 text-[11px] animate-in fade-in duration-300">
                                                        <span className="col-span-3 truncate font-bold text-textPrimary">
                                                            {item.product.name}
                                                        </span>
                                                        <span className="col-span-1 text-center font-black text-textPrimary">
                                                            x{item.quantity}
                                                        </span>
                                                        <span className="col-span-1 text-right font-black text-primary">
                                                            PKR {item.product.price.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                                {rider.activeTask.items && rider.activeTask.items.length > (expandedRiderId === rider.id ? 0 : 1) && (
                                                    <div className="text-[10px] font-black text-orange-500 mt-1 flex items-center gap-1 group-hover:text-orange-600">
                                                        {expandedRiderId === rider.id ? (
                                                            <span className="flex items-center gap-1 opacity-60">Show less <ChevronUp size={10} /></span>
                                                        ) : (
                                                            <span className="flex items-center gap-1">+{rider.activeTask.items.length - 1} more items <ChevronDown size={10} /></span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-medium text-textSecondary  opacity-50 uppercase tracking-widest">Waiting for task</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <Badge variant="flat" className={`rounded-full uppercase text-[9px] font-bold tracking-widest px-2 py-1 ${rider.status === 'available' ? 'bg-success/10 text-success' :
                                        rider.status === 'busy' ? 'bg-primary/10 text-primary' :
                                            'bg-textSecondary/10 text-textSecondary'
                                        }`}>
                                        {rider.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col bg-background p-3 sm:p-5 lg:p-7">
            {/* Standardized Header Box (Matching Tables Management) */}
            <div className="p-4 sm:p-6 rounded-2xl border border-border mb-6 shadow-sm bg-surface">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-textPrimary mb-1 lg:mb-2 tracking-tight">
                            Rider Management
                        </h1>
                        <p className="text-xs sm:text-sm text-textSecondary font-medium opacity-70">
                            Monitor and manage your delivery fleet in real-time.
                        </p>
                    </div>

                    {/* Quick Stats in Header */}
                    <div className="flex gap-3 w-full lg:w-auto overflow-x-auto scrollbar-hidden pb-1 lg:pb-0">
                        {[
                            { label: 'Total Riders', key: 'all', count: stats.all, color: 'bg-textSecondary' },
                            { label: 'Available', key: 'available', count: stats.available, color: 'bg-success' },
                            { label: 'Busy Now', key: 'busy', count: stats.busy, color: 'bg-primary' },
                        ].map((stat) => (
                            <div key={stat.key} className="px-4 py-3 rounded-xl bg-background/50 border border-border flex-shrink-0 transition-all hover:bg-background min-w-[120px]">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${stat.color} ${stat.key === 'available' ? 'animate-pulse' : ''}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-textSecondary whitespace-nowrap opacity-60">
                                            {stat.label}
                                        </span>
                                    </div>
                                    <div className="text-xl font-black text-textPrimary">
                                        {stat.count}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Unified Search and Filters Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border/10">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hidden pb-1 md:pb-0 order-2 md:order-1">
                        <Tabs
                            variant="pills"
                            size="sm"
                            isDarkMode={isDarkMode}
                            onTabChange={(tabId) => setStatusFilter(tabId as any)}
                            defaultActiveTab={statusFilter}
                            className="mt-0"
                            items={[
                                { id: 'all', name: 'All Status', content: null },
                                { id: 'available', name: 'Available', content: null },
                                { id: 'busy', name: 'On Duty', content: null },
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-1 w-full md:max-w-md order-1 md:order-2">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary/50 pointer-events-none" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, ID or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 text-textPrimary text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-textSecondary/40"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center p-1.5 rounded-xl border border-border bg-background/50 shrink-0">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-textSecondary hover:bg-surface/50'
                                    }`}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-textSecondary hover:bg-surface/50'
                                    }`}
                                title="Grid View"
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {viewMode === 'grid' ? GridView : ListView}
            </div>

            {/* Live Location Tracking Modal */}
            <ReusableModal
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                title="Rider Live Tracking"
                size="lg"
                isDarkMode={isDarkMode}
            >
                {selectedRiderForMap && (
                    <div className="flex flex-col gap-6">
                        {/* Real Google Maps Container */}
                        <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-border shadow-lg">
                            {!isMapLoaded ? (
                                // Loading state
                                <div className="absolute inset-0 bg-background flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                        <span className="text-xs font-bold text-textSecondary">Loading map...</span>
                                    </div>
                                </div>
                            ) : !selectedRiderForMap.currentLocation ? (
                                // No location data
                                <div className="absolute inset-0 bg-background flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="mx-auto text-textSecondary mb-2" size={32} />
                                        <span className="text-xs font-bold text-textSecondary">Location not available</span>
                                    </div>
                                </div>
                            ) : null}

                            {/* Google Maps DIV */}
                            <div
                                ref={mapRef}
                                key={mapKey}
                                className="w-full h-full rounded-2xl"
                                style={{ minHeight: '320px' }}
                            />
                            {/* Animated Bike Marker Overlay */}
                            {selectedRiderForMap.currentLocation && isMapLoaded && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                                    <div className="relative">
                                        {/* Pulsing Circle Background */}
                                        <div className="absolute inset-0 -m-6">
                                            <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping" />
                                        </div>
                                        {/* Lottie Bike Animation */}
                                        <div className="relative z-20 w-20 h-20 drop-shadow-xl">
                                            <Lottie
                                                animationData={bikeAnimation}
                                                loop={true}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Location Info Overlay */}
                            {selectedRiderForMap.currentLocation && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface/95 backdrop-blur-sm px-6 py-2.5 rounded-full border border-border shadow-lg flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-textPrimary">Signal Stable</span>
                                    </div>
                                    <div className="w-px h-3 bg-border" />
                                    <div className="text-[10px] font-bold whitespace-nowrap text-textPrimary flex items-center gap-1.5">
                                        <MapPin size={10} className="text-primary" />
                                        {selectedRiderForMap.cityArea}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rider Info Card */}
                        <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar src={selectedRiderForMap.avatar} name={selectedRiderForMap.name} className="w-12 h-12 rounded-xl" />
                                <div>
                                    <h3 className="text-base font-black text-textPrimary">{selectedRiderForMap.name}</h3>
                                    <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-textSecondary">{selectedRiderForMap.id} • {selectedRiderForMap.vehicleNumber}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5 text-textSecondary">Assigned To</div>
                                <div className="text-xs font-bold text-primary">{selectedRiderForMap.activeTask?.orderNumber || 'Available '}</div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setIsMapModalOpen(false)}
                                className="flex-1 py-3 rounded-xl border border-border hover:bg-surface text-[11px] font-black uppercase tracking-widest transition-all text-textSecondary"
                            >
                                Close Tracking
                            </button>
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="flex-1 py-3 rounded-xl shadow-lg shadow-primary/20 text-[11px] font-black uppercase tracking-widest transition-all bg-primary text-white hover:shadow-xl hover:scale-[1.02]"
                            >
                                Contact Rider
                            </button>
                        </div>
                    </div>
                )}
            </ReusableModal>

            {/* Contact Rider Modal */}
            {selectedRiderForMap && (
                <ContactRiderModal
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                    riderName={selectedRiderForMap.name}
                    phoneNumber={selectedRiderForMap.phone}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
};
