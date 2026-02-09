/**
 * Leads Service - Handle saving and updating leads in Supabase
 * Captures abandoned booking information for follow-up
 */

import { supabase } from './supabase';

export interface LeadData {
    lead_name: string;
    email: string;
    phone: string;
    vehicle_id?: string;
    pickup_location?: string;
    dropoff_location?: string;
    pickup_date?: string;
    pickup_time?: string;
    return_date?: string;
    rental_days?: number;
    estimated_price?: number;
    drive_option?: 'self-drive' | 'with-driver' | '';
    last_step: 'date_selection' | 'renter_info' | 'payment';
}

export interface SaveLeadResponse {
    success: boolean;
    leadId?: string;
    error?: string;
}

/**
 * Save or update a lead in the abandoned_leads table
 * Uses email + vehicle_id as a unique identifier to upsert
 */
export const saveOrUpdateLead = async (leadData: LeadData): Promise<SaveLeadResponse> => {
    try {
        console.log('💾 Saving lead to Supabase:', leadData.email);

        // Check if a lead already exists with same email and vehicle
        const { data: existingLead, error: fetchError } = await supabase
            .from('abandoned_leads')
            .select('id, status')
            .eq('email', leadData.email)
            .eq('vehicle_id', leadData.vehicle_id)
            .maybeSingle();

        if (fetchError) {
            console.error('❌ Error checking existing lead:', fetchError);
            // Continue anyway - we'll try to insert
        }

        // If lead exists and is already recovered, don't update
        if (existingLead?.status === 'recovered') {
            console.log('ℹ️ Lead already recovered, skipping update');
            return { success: true, leadId: existingLead.id };
        }

        // Prepare lead record
        const leadRecord = {
            lead_name: leadData.lead_name,
            email: leadData.email,
            phone: leadData.phone,
            vehicle_id: leadData.vehicle_id || null,
            pickup_location: leadData.pickup_location || null,
            dropoff_location: leadData.dropoff_location || null,
            pickup_date: leadData.pickup_date || null,
            pickup_time: leadData.pickup_time || null,
            return_date: leadData.return_date || null,
            rental_days: leadData.rental_days || null,
            estimated_price: leadData.estimated_price || null,
            drive_option: leadData.drive_option || null,
            last_step: leadData.last_step,
            drop_off_timestamp: new Date().toISOString(),
            status: 'pending',
            automation_status: 'not_sent',
        };

        let result;

        if (existingLead) {
            // Update existing lead
            console.log('📝 Updating existing lead:', existingLead.id);
            result = await supabase
                .from('abandoned_leads')
                .update(leadRecord)
                .eq('id', existingLead.id)
                .select('id')
                .single();
        } else {
            // Insert new lead
            console.log('➕ Creating new lead');
            result = await supabase
                .from('abandoned_leads')
                .insert(leadRecord)
                .select('id')
                .single();
        }

        if (result.error) {
            console.error('❌ Error saving lead:', result.error);
            return { success: false, error: result.error.message };
        }

        console.log('✅ Lead saved successfully:', result.data?.id);
        return { success: true, leadId: result.data?.id };

    } catch (error) {
        console.error('❌ Error in saveOrUpdateLead:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * Mark a lead as recovered when booking is completed
 */
export const markLeadAsRecovered = async (
    email: string,
    vehicleId: string,
    bookingId: string
): Promise<boolean> => {
    try {
        console.log('🎉 Marking lead as recovered:', email);

        const { error } = await supabase
            .from('abandoned_leads')
            .update({
                status: 'recovered',
                recovered_booking_id: bookingId,
            })
            .eq('email', email)
            .eq('vehicle_id', vehicleId);

        if (error) {
            console.error('❌ Error marking lead as recovered:', error);
            return false;
        }

        console.log('✅ Lead marked as recovered');
        return true;
    } catch (error) {
        console.error('❌ Error in markLeadAsRecovered:', error);
        return false;
    }
};

/**
 * Debounce helper for lead saving
 */
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const debouncedSaveLead = (leadData: LeadData, delayMs = 2000): void => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
        saveOrUpdateLead(leadData);
    }, delayMs);
};

/**
 * Cancel any pending debounced save
 */
export const cancelPendingSave = (): void => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }
};
