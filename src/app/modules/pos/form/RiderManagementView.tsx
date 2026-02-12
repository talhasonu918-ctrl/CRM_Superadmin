import React, { useState, useMemo, useEffect } from 'react';
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
    const [selectedRiderForMap, setSelectedRiderForMap] = useState<Rider | null>(null);

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

    const GridView = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredRiders.map(rider => (
                <div
                    key={rider.id}
                    className="p-4 rounded-xl border border-border transition-all hover:shadow-md bg-surface"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <Avatar src={rider.avatar} name={rider.name} className="w-12 h-12 rounded-lg object-cover ring-2 ring-primary/5 shadow-sm" />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${getStatusColor(rider.status)}`} />
                        </div>
                        <h3 className="font-bold text-base text-textPrimary mb-1">{rider.name}</h3>
                        <div className="text-xs font-semibold text-textSecondary mb-0.5">
                            {rider.id}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs flex items-center font-semibold text-textSecondary mb-0.5">
                            <Phone size={12} className="mr-1" />
                            {rider.phone}
                        </div>
                        <div className="text-xs flex items-center font-medium opacity-60 text-textSecondary mb-4">
                            <MapPin size={12} className="mr-1" />
                            {rider.cityArea}
                        </div>
                    </div>

                    {/* Active Task Section - Grid View */}
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
                            <span className="text-[10px] font-bold uppercase tracking-widest italic text-textSecondary">Waiting for Task</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => handleOpenMap(rider)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/10 bg-primary/5 text-[10px] font-bold uppercase tracking-wider transition-all text-primary hover:bg-primary/10"
                        >
                            <MapPin size={14} />
                            Track Location
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
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
        <div className="rounded-xl border border-border overflow-hidden shadow-sm mt-6 bg-surface">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-background/50 border-b border-border">
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-textSecondary">Rider Info</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-textSecondary">Orders</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-textSecondary">InProgress</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-textSecondary">Order Tasks</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-widest text-textSecondary">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                    {filteredRiders.map(rider => (
                        <tr key={rider.id} className="group hover:bg-surface/50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar src={rider.avatar} name={rider.name} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-gray-900' : 'border-white'} ${getStatusColor(rider.status)}`} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-textPrimary">{rider.name}</div>
                                        <div className="text-xs font-medium text-textSecondary opacity-60">{rider.id} • {rider.phone}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <Badge size="sm" variant="flat" className="bg-textSecondary/10 text-textSecondary text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                    {rider.performance.completedToday} Orders Today
                                </Badge>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-col min-w-0">
                                        <div className="text-sm font-bold text-textPrimary truncate">
                                            {rider.activeTask?.orderNumber || rider.vehicleNumber || 'N/A'}
                                        </div>
                                        <div className="text-[10px] font-medium text-textSecondary opacity-70 truncate max-w-[150px]">
                                            {rider.activeTask?.customerAddress || rider.cityArea}
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
                            <td className="px-4 py-3">
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
                                    <span className="text-[10px] font-medium text-textSecondary italic opacity-50">Waiting for task...</span>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <Badge variant="flat" className={`rounded-full uppercase text-[9px] font-bold tracking-widest px-2 py-0.5 ${rider.status === 'available' ? 'bg-success/10 text-success' :
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
    );

    return (
        <div className="min-h-[calc(100vh-12rem)] flex flex-col bg-background p-3 sm:p-4 lg:p-6">
            {/* Standardized Header Box (Matching Tables Management) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-border mb-6 shadow-sm bg-surface">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-textPrimary mb-1">
                            Rider Management
                        </h1>
                        <p className="text-[10px] sm:text-xs text-textSecondary">
                            Fleet Status • {riders.length} riders
                        </p>
                    </div>

                    {/* Quick Stats in Header */}
                    <div className="flex gap-2 lg:gap-3 w-full sm:w-auto overflow-x-auto scrollbar-hidden ml-auto">
                        {[
                            { label: 'Available', key: 'available', color: 'bg-success' },
                            { label: 'Busy', key: 'busy', color: 'bg-primary' },
                        ].map((stat) => (
                            <div key={stat.key} className="px-3 lg:px-4 py-2 rounded-lg bg-surface shadow-sm border border-border flex-shrink-0 transition-all hover:shadow-md">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${stat.color} ${stat.key === 'available' ? 'animate-pulse' : ''}`} />
                                    <div>
                                        <div className="text-[9px] font-medium uppercase tracking-wider text-textSecondary">{stat.label}</div>
                                        <div className="text-sm lg:text-base font-bold text-textPrimary">
                                            {stats[stat.key as keyof typeof stats] || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Unified Search and Filters Row - PERFECTLY ALIGNED IN ONE LINE */}
                <div className="flex flex-row items-center justify-between  gap-4">
                    <div className="flex-shrink-0 mt-4">
                        <Tabs
                            variant="pills"
                            size="sm"
                            isDarkMode={isDarkMode}
                            onTabChange={(tabId) => setStatusFilter(tabId as any)}
                            defaultActiveTab={statusFilter}
                            className="mt-0"
                            items={[
                                { id: 'all', name: 'All', content: null },
                                { id: 'available', name: 'Available', content: null },
                                { id: 'busy', name: 'Busy', content: null },
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-1 max-w-2xl px-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" size={14} />
                            <input
                                type="text"
                                placeholder="Search riders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-textPrimary text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center p-1 rounded-lg border border-border flex-shrink-0 bg-surface">

                        <button
                            onClick={() => setViewMode('list')}
                            className={`py-1 px-2 rounded-md text-[10px] transition-all flex items-center justify-center ${viewMode === 'list'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-textSecondary hover:bg-surface/10'
                                }`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md text-[10px] transition-all flex items-center justify-center ${viewMode === 'grid'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-textSecondary hover:bg-surface/10'
                                }`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
                        {/* Map Placeholder */}
                        <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-border shadow-inner bg-background flex items-center justify-center">
                            {/* Visual Grid for Map Mockup */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                            {/* Animated Marker */}
                            <div className="relative z-10">
                                <div className="absolute -inset-4 bg-primary/30 rounded-full animate-ping" />
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-900 relative z-20">
                                    <Bike className="text-white" size={24} />
                                </div>
                            </div>



                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-sm px-6 py-2.5 rounded-full border border-border shadow-lg flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-textPrimary">Signal Stable</span>
                                </div>
                                <div className="w-px h-3 bg-border" />
                                <div className="text-[10px] font-bold whitespace-nowrap text-textPrimary">Lat: 24.8607 • Long: 67.0011</div>
                            </div>
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
                                <div className="text-xs font-bold text-primary">{selectedRiderForMap.activeTask?.orderNumber || 'Waiting...'}</div>
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
                                className="flex-1 py-3 rounded-xl shadow-lg shadow-primary/20 text-[11px] font-black uppercase tracking-widest transition-all bg-primary text-white hover:shadow-xl hover:scale-[1.02]"
                            >
                                Contact Rider
                            </button>
                        </div>
                    </div>
                )}
            </ReusableModal>
        </div>
    );
};
