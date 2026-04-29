import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// District 18 Configuration (Al-Bynam)
const dist18Url = 'https://raiwctnevoqjjhgngays.supabase.co';
const dist18AnonKey = 'sb_publishable_Ey81JRvFZelYhmciOqAzkw_sUJpWHvt';

// District 19 Configuration
const dist19Url = 'https://kfedajtizynhuultbljn.supabase.co';
const dist19AnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZWRhanRpenluaHV1bHRibGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMjAzNDgsImV4cCI6MjA5Mjg5NjM0OH0.InuDzx0xYbs9D-E6ZJpV9Mylm_gxW0vcmN7V5kOCV4M';

// Get keys from storage (if admin provided them)
const sKey18 = localStorage.getItem('sector_dist18_service_key') || dist18AnonKey;
const sKey19 = localStorage.getItem('sector_dist19_service_key') || dist19AnonKey;

export const supabase18 = createClient(dist18Url, sKey18);
export const supabase19 = createClient(dist19Url, sKey19);

/**
 * Helper to fetch data with direct REST API if needed (bypasses RLS if service key used)
 */
export async function fetchWithBypass(distId, table, queryParams = '') {
    const url = distId === 18 ? dist18Url : dist19Url;
    const key = distId === 18 ? sKey18 : sKey19;

    try {
        const response = await fetch(`${url}/rest/v1/${table}?${queryParams}`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error(`Error fetching from Dist ${distId}:`, err);
        return null;
    }
}

// Global Logout
window.handleSectorLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج من إدارة القاطع؟')) {
        localStorage.removeItem('sectorSession');
        window.location.href = 'index.html';
    }
};
