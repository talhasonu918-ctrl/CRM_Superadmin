import React from 'react';
import { Phone, MessageSquare, X } from 'lucide-react';
import { ReusableModal } from '../../../../components/ReusableModal';
import { FaWhatsapp } from "react-icons/fa";
import { MdAddIcCall } from "react-icons/md";
import toast from 'react-hot-toast';

interface ContactRiderModalProps {
    isOpen: boolean;
    onClose: () => void;
    riderName: string;
    phoneNumber?: string;
    isDarkMode?: boolean;
}

const ContactRiderModal: React.FC<ContactRiderModalProps> = ({
    isOpen,
    onClose,
    riderName,
    phoneNumber,
    isDarkMode = false
}) => {

    const handleCall = () => {
        if (!phoneNumber) {
            toast.error('Rider phone number is missing');
            return;
        }
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleWhatsApp = () => {
        if (!phoneNumber) {
            toast.error('Rider phone number is missing');
            return;
        }

        // Format phone number: remove non-digits and ensure it starts with country code if needed
        // Assuming the phone numbers in mock data might need formatting for wa.me
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        const message = encodeURIComponent("Hello, I am tracking my order. Please update me.");
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Contact Rider"
            size="sm"
            isDarkMode={isDarkMode}
        >
            <div className="flex flex-col gap-6 p-2">
                <div className="text-center mb-2">
                    <p className="text-sm text-textSecondary font-medium">
                        How would you like to contact <span className="text-textPrimary font-bold">{riderName}</span>?
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Call Option */}
                    <button
                        onClick={handleCall}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface hover:bg-primary/5 hover:border-primary/30 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <MdAddIcCall size={24} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-base font-bold text-textPrimary">Call Rider</h4>
                            <p className="text-xs text-textSecondary">{phoneNumber || 'Phone not available'}</p>
                        </div>
                    </button>

                    {/* WhatsApp Option */}
                    <button
                        onClick={handleWhatsApp}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-surface hover:bg-success/5 hover:border-success/30 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                            <FaWhatsapp size={24} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-base font-bold text-textPrimary">Chat on WhatsApp</h4>
                            <p className="text-xs text-textSecondary">Instant Messaging</p>
                        </div>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-2 w-full py-3 bg-primary rounded-xl border border-border hover:bg-surface hover:text-black text-[11px] font-black uppercase tracking-widest transition-all text-white"
                >
                    Cancel
                </button>
            </div>
        </ReusableModal>
    );
};

export default ContactRiderModal;
