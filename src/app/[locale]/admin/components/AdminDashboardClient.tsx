'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { KPICard } from '@/components/molecules/KPICard/KPICard';
import { Badge } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';
import { Icon } from '@/components/atoms/Icon/Icon';
import { exportToCsv, exportToJson, printOrSavePdf } from '@/lib/utils/exportData';
import { ALL_DISTRICTS } from '@/constants';
import { EditCaseModal } from '@/components/molecules/EditCaseModal/EditCaseModal';
import { NepalSolidarityPlayer } from '@/components/molecules/NepalSolidarityPlayer/NepalSolidarityPlayer';

interface AdminDashboardClientProps {
  initialMetrics?: any;
  initialCases: any[];
  initialTips: any[];
  initialGallery?: any[];
  initialCommunity?: any[];
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  initialCases,
  initialTips,
  initialGallery,
  initialCommunity
}) => {
  const [cases, setCases] = useState<any[]>(initialCases || []);
  const [tips, setTips] = useState<any[]>(initialTips || []);
  const [gallery, setGallery] = useState<any[]>(initialGallery || []);
  const [community, setCommunity] = useState<any[]>(initialCommunity || []);
  
  const [activeTab, setActiveTab] = useState<'cases' | 'community' | 'gallery' | 'tips' | 'export'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingCase, setEditingCase] = useState<any | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Bulk Selection States
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [selectedTipIds, setSelectedTipIds] = useState<(number | string)[]>([]);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fetchLatestData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cases', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setCases(data.cases || []);
        setTips(data.tips || []);
        setGallery(data.gallery || []);
        setCommunity(data.community || []);
      }
    } catch (err) {
      console.warn('Background sync notice:', err);
    }
  }, []);

  // Live Auto-Refresh Interval
  useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      fetchLatestData();
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveActive, fetchLatestData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchLatestData();
    setIsRefreshing(false);
  };

  const getDistrictName = (id: number) => {
    const d = ALL_DISTRICTS.find(item => item.id === id);
    return d ? `${d.nameEn} (${d.nameNe})` : `District ${id}`;
  };

  // --- 1. CASES MANAGEMENT ---
  const filteredCases = (cases || []).filter(c => {
    const matchesSearch = 
      (c.fullName && c.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.caseId && c.caseId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.lastKnownLocation && c.lastKnownLocation.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectCase = (caseId: string) => {
    setSelectedCaseIds(prev => 
      prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]
    );
  };

  const toggleSelectAllCases = () => {
    if (selectedCaseIds.length === filteredCases.length && filteredCases.length > 0) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(filteredCases.map(c => c.caseId));
    }
  };

  const handleDeleteSelectedCases = async () => {
    if (selectedCaseIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedCaseIds.length} selected cases? This cannot be undone.`)) return;

    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_selected_cases', caseIds: selectedCaseIds })
      });
      if (res.ok) {
        setCases(prev => prev.filter(c => !selectedCaseIds.includes(c.caseId)));
        setSelectedCaseIds([]);
      }
    } catch (err) {
      console.error('Failed to delete selected cases:', err);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteAllCases = async () => {
    if (cases.length === 0) return;
    const confirmPrompt = window.prompt(`⚠️ DANGER: Type "DELETE ALL CASES" to permanently purge all ${cases.length} case records:`);
    if (confirmPrompt !== 'DELETE ALL CASES') {
      alert('Action cancelled.');
      return;
    }

    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all_cases' })
      });
      if (res.ok) {
        setCases([]);
        setSelectedCaseIds([]);
      }
    } catch (err) {
      console.error('Failed to purge all cases:', err);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleStatusUpdate = async (caseId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, status: newStatus })
      });
      if (res.ok) {
        setCases(prev => prev.map(c => c.caseId === caseId ? { ...c, status: newStatus } : c));
      }
    } catch (e) {
      console.error('Failed to update case:', e);
    }
  };

  const handleSaveEditedCase = async (updatedData: any) => {
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit_case', caseId: updatedData.caseId, data: updatedData })
      });
      if (res.ok) {
        setCases(prev => prev.map(c => c.caseId === updatedData.caseId ? { ...c, ...updatedData } : c));
      }
    } catch (e) {
      console.error('Failed to edit case:', e);
      throw e;
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    try {
      const res = await fetch(`/api/admin/cases?caseId=${encodeURIComponent(caseId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCases(prev => prev.filter(c => c.caseId !== caseId));
        setSelectedCaseIds(prev => prev.filter(id => id !== caseId));
      }
    } catch (e) {
      console.error('Failed to delete case:', e);
      throw e;
    }
  };

  // --- 2. COMMUNITY POSTS MANAGEMENT ---
  const filteredCommunity = (community || []).filter(p => 
    (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.content && p.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelectPost = (postId: string) => {
    setSelectedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleSelectAllPosts = () => {
    if (selectedPostIds.length === filteredCommunity.length && filteredCommunity.length > 0) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredCommunity.map(p => p.id));
    }
  };

  const handleDeleteSelectedPosts = async () => {
    if (selectedPostIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedPostIds.length} selected community posts?`)) return;

    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_selected_posts', postIds: selectedPostIds })
      });
      if (res.ok) {
        setCommunity(prev => prev.filter(p => !selectedPostIds.includes(p.id)));
        setSelectedPostIds([]);
      }
    } catch (err) {
      console.error('Failed to delete selected posts:', err);
    }
  };

  const handleDeleteAllPosts = async () => {
    if (community.length === 0) return;
    if (!window.confirm(`Permanently delete all ${community.length} community posts and comments?`)) return;

    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all_posts' })
      });
      if (res.ok) {
        setCommunity([]);
        setSelectedPostIds([]);
      }
    } catch (err) {
      console.error('Failed to delete all posts:', err);
    }
  };

  const handleDeleteSinglePost = async (postId: string) => {
    if (!window.confirm('Permanently delete this community post?')) return;
    try {
      const res = await fetch(`/api/admin/cases?postId=${encodeURIComponent(postId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCommunity(prev => prev.filter(p => p.id !== postId));
        setSelectedPostIds(prev => prev.filter(id => id !== postId));
      }
    } catch (e) {
      console.error('Failed to delete post:', e);
    }
  };

  const handleDeleteSingleComment = async (commentId: string, postId: string) => {
    if (!window.confirm('Permanently delete this comment?')) return;
    try {
      const res = await fetch(`/api/admin/cases?commentId=${encodeURIComponent(commentId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCommunity(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, comments: (p.comments || []).filter((c: any) => c.id !== commentId) };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error('Failed to delete comment:', e);
    }
  };

  // --- 3. GALLERY MANAGEMENT ---
  const filteredGallery = (gallery || []).filter(g =>
    (g.caption && g.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (g.source && g.source.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelectGallery = (id: string) => {
    setSelectedGalleryIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllGallery = () => {
    if (selectedGalleryIds.length === filteredGallery.length && filteredGallery.length > 0) {
      setSelectedGalleryIds([]);
    } else {
      setSelectedGalleryIds(filteredGallery.map(g => g.id));
    }
  };

  const handleDeleteSelectedGallery = async () => {
    if (selectedGalleryIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedGalleryIds.length} selected photos?`)) return;

    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_selected_gallery', imageIds: selectedGalleryIds })
      });
      if (res.ok) {
        setGallery(prev => prev.filter(g => !selectedGalleryIds.includes(g.id)));
        setSelectedGalleryIds([]);
      }
    } catch (err) {
      console.error('Failed to delete selected gallery photos:', err);
    }
  };

  const handleDeleteAllGallery = async () => {
    if (gallery.length === 0) return;
    if (!window.confirm(`Permanently delete all ${gallery.length} photos from the gallery archive?`)) return;

    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all_gallery' })
      });
      if (res.ok) {
        setGallery([]);
        setSelectedGalleryIds([]);
      }
    } catch (err) {
      console.error('Failed to delete all gallery photos:', err);
    }
  };

  const handleDeleteSingleGallery = async (id: string) => {
    if (!window.confirm('Permanently delete this photo from the disaster archive?')) return;
    try {
      const res = await fetch(`/api/admin/cases?galleryId=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setGallery(prev => prev.filter(g => g.id !== id));
        setSelectedGalleryIds(prev => prev.filter(item => item !== id));
      }
    } catch (e) {
      console.error('Failed to delete photo:', e);
    }
  };

  // --- 4. TIPS MANAGEMENT ---
  const filteredTips = (tips || []).filter(t =>
    (t.caseId && t.caseId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.tipText && t.tipText.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.contactInfo && t.contactInfo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelectTip = (tipId: number | string) => {
    setSelectedTipIds(prev => 
      prev.includes(tipId) ? prev.filter(id => id !== tipId) : [...prev, tipId]
    );
  };

  const toggleSelectAllTips = () => {
    if (selectedTipIds.length === filteredTips.length && filteredTips.length > 0) {
      setSelectedTipIds([]);
    } else {
      setSelectedTipIds(filteredTips.map(t => t.id));
    }
  };

  const handleDeleteSelectedTips = async () => {
    if (selectedTipIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedTipIds.length} selected tips?`)) return;

    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_selected_tips', tipIds: selectedTipIds })
      });
      if (res.ok) {
        setTips(prev => prev.filter(t => !selectedTipIds.includes(t.id)));
        setSelectedTipIds([]);
      }
    } catch (err) {
      console.error('Failed to delete selected tips:', err);
    }
  };

  const handleDeleteAllTips = async () => {
    if (tips.length === 0) return;
    if (!window.confirm(`Permanently delete all ${tips.length} tips?`)) return;

    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all_tips' })
      });
      if (res.ok) {
        setTips([]);
        setSelectedTipIds([]);
      }
    } catch (err) {
      console.error('Failed to delete all tips:', err);
    }
  };

  const handleDeleteTip = async (tipId: number | string) => {
    if (!window.confirm('Permanently delete this information tip?')) return;
    try {
      const res = await fetch(`/api/admin/cases?tipId=${encodeURIComponent(tipId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTips(prev => prev.filter(t => t.id !== tipId));
        setSelectedTipIds(prev => prev.filter(id => id !== tipId));
      }
    } catch (e) {
      console.error('Failed to delete tip:', e);
    }
  };

  // --- 5. PERMANENT FACTORY WIPE ---
  const handleHardPurgeAllData = async () => {
    const confirmation = window.prompt(
      '⚠️ CRITICAL: This will PERMANENTLY ERASE ALL cases, sighting tips, gallery photos, and community posts from SQLite with ZERO recovery option.\n\nType "PERMANENT WIPE" to confirm:'
    );
    if (confirmation !== 'PERMANENT WIPE') {
      alert('Permanent wipe cancelled.');
      return;
    }

    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hard_purge_all' })
      });
      const data = await res.json();
      if (data.success) {
        setCases([]);
        setTips([]);
        setGallery([]);
        setCommunity([]);
        setSelectedCaseIds([]);
        setSelectedTipIds([]);
        setSelectedGalleryIds([]);
        setSelectedPostIds([]);
        alert('✅ All database records permanently erased and disk storage vacuumed.');
      } else {
        alert(`Error: ${data.error || 'Failed to hard purge data'}`);
      }
    } catch (err) {
      console.error('Failed to hard purge database:', err);
      alert('Failed to execute permanent wipe.');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div>
      {/* Top Header & Quick Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '24px' }}>🇳🇵</span>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: '#ffffff' }}>
              Mission Control & Admin Console
            </h1>
          </div>
          <p style={{ color: 'var(--color-slate-400)' }}>
            Centralized search, moderation, and permanent deletion controls for Cases, Community Feed, and Gallery Archives.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Live Polling Toggle */}
          <button
            onClick={() => setIsLiveActive(!isLiveActive)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: isLiveActive ? '#141417' : '#27272a',
              border: `1px solid ${isLiveActive ? '#10b981' : '#52525b'}`,
              borderRadius: 'var(--radius-full)',
              color: '#ffffff',
              fontSize: 'var(--text-xs)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            title="Toggle automatic live background synchronization"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isLiveActive ? '#10b981' : '#71717a' }} />
            <span>{isLiveActive ? 'Live Auto-Sync (3s)' : 'Sync Paused'}</span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleManualRefresh}
            loading={isRefreshing}
            icon={<Icon name="RefreshCw" size={14} />}
          >
            Refresh
          </Button>

          <NepalSolidarityPlayer variant="compact" />

          <Button
            variant="primary"
            size="sm"
            onClick={() => printOrSavePdf(cases, 'Find My Family — Official Government Disaster Roster')}
            icon={<Icon name="Printer" size={16} />}
          >
            Print PDF
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)'
      }}>
        <KPICard 
          title="Active Missing" 
          value={(cases || []).filter(c => c.status === 'missing').length} 
          icon="Users" 
          trend="Cases" 
          trendDirection="neutral" 
        />
        <KPICard 
          title="Found / Safe / Reunited" 
          value={(cases || []).filter(c => c.status !== 'missing').length} 
          icon="CheckCircle" 
          trend="Saved" 
          trendDirection="up" 
        />
        <KPICard 
          title="Citizen Sighting Tips" 
          value={(tips || []).length} 
          icon="MessageSquare" 
          trend="Sightings" 
          trendDirection="neutral" 
        />
        <KPICard 
          title="Community Posts" 
          value={(community || []).length} 
          icon="MessageCircle" 
          trend="Discussions" 
          trendDirection="neutral" 
        />
        <KPICard 
          title="Gallery Evidence" 
          value={(gallery || []).length} 
          icon="Image" 
          trend="Photos" 
          trendDirection="neutral" 
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid #27272a', marginBottom: 'var(--space-6)', overflowX: 'auto' }}>
        <button
          onClick={() => { setActiveTab('cases'); setSearchQuery(''); }}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: `2px solid ${activeTab === 'cases' ? '#ffffff' : 'transparent'}`,
            color: activeTab === 'cases' ? '#ffffff' : '#71717a',
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Icon name="Users" size={16} />
          <span>Missing & Found Cases ({(cases || []).length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('community'); setSearchQuery(''); }}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: `2px solid ${activeTab === 'community' ? '#ffffff' : 'transparent'}`,
            color: activeTab === 'community' ? '#ffffff' : '#71717a',
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Icon name="MessageCircle" size={16} />
          <span>Community Feed ({(community || []).length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('gallery'); setSearchQuery(''); }}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: `2px solid ${activeTab === 'gallery' ? '#ffffff' : 'transparent'}`,
            color: activeTab === 'gallery' ? '#ffffff' : '#71717a',
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Icon name="Image" size={16} />
          <span>Gallery Archives ({(gallery || []).length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('tips'); setSearchQuery(''); }}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: `2px solid ${activeTab === 'tips' ? '#ffffff' : 'transparent'}`,
            color: activeTab === 'tips' ? '#ffffff' : '#71717a',
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Icon name="Inbox" size={16} />
          <span>Sighting Tips ({(tips || []).length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('export'); setSearchQuery(''); }}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            borderBottom: `2px solid ${activeTab === 'export' ? '#ffffff' : 'transparent'}`,
            color: activeTab === 'export' ? '#ffffff' : '#71717a',
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Icon name="DownloadCloud" size={16} />
          <span>Export & Wipe Tools</span>
        </button>
      </div>

      {/* ===================== TAB 1: ALL CASES ===================== */}
      {activeTab === 'cases' && (
        <div style={{ backgroundColor: '#111113', borderRadius: 'var(--radius-xl)', border: '1px solid #27272a', overflow: 'hidden' }}>
          {/* Search & Filter Bar */}
          <div style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid #27272a',
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            backgroundColor: '#0c0c0e'
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flex: 1, minWidth: '240px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search cases by name, Case ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-sm)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
              {['all', 'missing', 'safe', 'injured', 'deceased', 'reunited'].map(status => (
                <button
                  key={`status-btn-${status}`}
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${selectedStatus === status ? '#ffffff' : '#27272a'}`,
                    backgroundColor: selectedStatus === status ? '#ffffff' : '#141417',
                    color: selectedStatus === status ? '#000000' : '#a1a1aa',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action Toolbar */}
          <div style={{
            padding: '10px 16px',
            backgroundColor: '#141417',
            borderBottom: '1px solid #27272a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: '#ffffff' }}>
                <input
                  type="checkbox"
                  checked={filteredCases.length > 0 && selectedCaseIds.length === filteredCases.length}
                  onChange={toggleSelectAllCases}
                  style={{ width: '16px', height: '16px', accentColor: '#ffffff', cursor: 'pointer' }}
                />
                <span>Select All ({selectedCaseIds.length}/{filteredCases.length} selected)</span>
              </label>

              {selectedCaseIds.length > 0 && (
                <button
                  onClick={() => setSelectedCaseIds([])}
                  style={{ background: 'none', border: 'none', color: '#71717a', fontSize: 'var(--text-xs)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {selectedCaseIds.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteSelectedCases}
                  loading={isBulkDeleting}
                  icon={<Icon name="Trash2" size={14} />}
                >
                  Delete Selected ({selectedCaseIds.length})
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAllCases}
                loading={isBulkDeleting}
                style={{ color: '#ef4444', borderColor: '#7f1d1d' }}
                icon={<Icon name="AlertTriangle" size={14} />}
              >
                Purge All Cases
              </Button>
            </div>
          </div>

          {/* Cases Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ backgroundColor: '#0c0c0e', borderBottom: '1px solid #27272a' }}>
                  <th style={{ padding: '12px 16px', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={filteredCases.length > 0 && selectedCaseIds.length === filteredCases.length}
                      onChange={toggleSelectAllCases}
                      style={{ width: '16px', height: '16px', accentColor: '#ffffff', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold' }}>Case ID</th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold' }}>Name / Age / Gender</th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold' }}>Location & District</th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold' }}>Reporter Info</th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold' }}>Status Select</th>
                  <th style={{ padding: '12px 16px', color: '#71717a', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#71717a' }}>
                      No cases found in database.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c, idx) => {
                    const isSelected = selectedCaseIds.includes(c.caseId);
                    return (
                      <tr 
                        key={c.caseId ? `case-${c.caseId}` : `case-idx-${idx}`} 
                        style={{ 
                          borderBottom: '1px solid #27272a',
                          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCase(c.caseId)}
                            style={{ width: '16px', height: '16px', accentColor: '#ffffff', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 'bold', color: '#ffffff' }}>
                          {c.caseId}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{c.fullName}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                            {c.age || '?'} yrs • {c.gender}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <Badge variant="status" status={c.status === 'safe' ? 'found-safe' : c.status === 'injured' ? 'found-injured' : c.status === 'deceased' ? 'found-deceased' : 'missing'} size="sm">
                            {(c.status || 'missing').toUpperCase()}
                          </Badge>
                        </td>
                        <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                          <div style={{ color: '#ffffff', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.lastKnownLocation}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                            {getDistrictName(c.districtId)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 'var(--text-xs)' }}>
                          <div style={{ color: '#ffffff' }}>{c.reporterName || 'Anonymous'}</div>
                          <div style={{ color: '#71717a', fontFamily: 'monospace' }}>{c.reporterPhone}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusUpdate(c.caseId, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #27272a',
                              backgroundColor: '#18181b',
                              color: '#ffffff',
                              fontSize: 'var(--text-xs)'
                            }}
                          >
                            <option value="missing">Missing</option>
                            <option value="safe">Safe</option>
                            <option value="injured">Injured</option>
                            <option value="reunited">Reunited</option>
                            <option value="deceased">Deceased</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setEditingCase(c)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#18181b',
                                border: '1px solid #27272a',
                                borderRadius: 'var(--radius-sm)',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: 'var(--text-xs)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Edit full case details"
                            >
                              <Icon name="Edit2" size={12} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteCase(c.caseId)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#18181b',
                                border: '1px solid #7f1d1d',
                                borderRadius: 'var(--radius-sm)',
                                color: '#f87171',
                                cursor: 'pointer',
                                fontSize: 'var(--text-xs)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Delete case permanently"
                            >
                              <Icon name="Trash2" size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: COMMUNITY FEED ===================== */}
      {activeTab === 'community' && (
        <div style={{ backgroundColor: '#111113', borderRadius: 'var(--radius-xl)', border: '1px solid #27272a', padding: 'var(--space-6)' }}>
          {/* Header & Bulk Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#ffffff' }}>
                Community Discussions & Field Posts ({(community || []).length})
              </h3>
              <span style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                Moderate and permanently delete community posts and citizen replies
              </span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search posts or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-xs)'
                }}
              />

              {(community || []).length > 0 && (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: 'var(--text-xs)', color: '#ffffff' }}>
                    <input
                      type="checkbox"
                      checked={selectedPostIds.length === filteredCommunity.length && filteredCommunity.length > 0}
                      onChange={toggleSelectAllPosts}
                      style={{ width: '15px', height: '15px', accentColor: '#ffffff' }}
                    />
                    <span>Select All ({selectedPostIds.length}/{filteredCommunity.length})</span>
                  </label>

                  {selectedPostIds.length > 0 && (
                    <Button variant="danger" size="sm" onClick={handleDeleteSelectedPosts}>
                      Delete Selected ({selectedPostIds.length})
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleDeleteAllPosts} style={{ color: '#ef4444', borderColor: '#7f1d1d' }}>
                    Purge All Posts
                  </Button>
                </>
              )}
            </div>
          </div>

          {filteredCommunity.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#71717a' }}>
              No community posts found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {filteredCommunity.map((post) => {
                const isSelected = selectedPostIds.includes(post.id);
                return (
                  <div key={`admin-post-${post.id}`} style={{
                    padding: 'var(--space-4)',
                    backgroundColor: isSelected ? '#18181f' : '#141417',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${isSelected ? '#ffffff' : '#27272a'}`,
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectPost(post.id)}
                      style={{ width: '16px', height: '16px', marginTop: '4px', accentColor: '#ffffff', cursor: 'pointer' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#ffffff' }}>{post.author}</strong>
                          <Badge variant="trust" trustTier={post.authorRole === 'Official' ? 'official' : 'community'} size="sm">
                            {post.authorRole || 'Citizen'}
                          </Badge>
                          <span style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                            {post.timestamp || 'Recent'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteSinglePost(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: 'var(--text-xs)'
                          }}
                          title="Delete post permanently"
                        >
                          <Icon name="Trash2" size={14} />
                          <span>Delete Post</span>
                        </button>
                      </div>

                      <p style={{ color: '#ffffff', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
                        {post.content}
                      </p>

                      {/* Comments / Replies List */}
                      {post.comments && post.comments.length > 0 && (
                        <div style={{
                          backgroundColor: '#0c0c0e',
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-3)',
                          border: '1px solid #27272a',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#a1a1aa' }}>
                            Replies ({post.comments.length}):
                          </span>
                          {post.comments.map((comment: any) => (
                            <div key={`comm-${comment.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                              <div>
                                <strong style={{ color: '#ffffff' }}>{comment.author}:</strong>{' '}
                                <span style={{ color: '#a1a1aa' }}>{comment.text}</span>
                              </div>
                              <button
                                onClick={() => handleDeleteSingleComment(comment.id, post.id)}
                                style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', padding: '2px 4px' }}
                                title="Delete reply"
                              >
                                <Icon name="Trash2" size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: GALLERY ARCHIVES ===================== */}
      {activeTab === 'gallery' && (
        <div style={{ backgroundColor: '#111113', borderRadius: 'var(--radius-xl)', border: '1px solid #27272a', padding: 'var(--space-6)' }}>
          {/* Header & Bulk Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#ffffff' }}>
                Disaster Photo Archive & Evidence ({(gallery || []).length})
              </h3>
              <span style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                Manage situational photos uploaded by citizens and verified field reporters
              </span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search caption or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-xs)'
                }}
              />

              {(gallery || []).length > 0 && (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: 'var(--text-xs)', color: '#ffffff' }}>
                    <input
                      type="checkbox"
                      checked={selectedGalleryIds.length === filteredGallery.length && filteredGallery.length > 0}
                      onChange={toggleSelectAllGallery}
                      style={{ width: '15px', height: '15px', accentColor: '#ffffff' }}
                    />
                    <span>Select All ({selectedGalleryIds.length}/{filteredGallery.length})</span>
                  </label>

                  {selectedGalleryIds.length > 0 && (
                    <Button variant="danger" size="sm" onClick={handleDeleteSelectedGallery}>
                      Delete Selected ({selectedGalleryIds.length})
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleDeleteAllGallery} style={{ color: '#ef4444', borderColor: '#7f1d1d' }}>
                    Purge All Photos
                  </Button>
                </>
              )}
            </div>
          </div>

          {filteredGallery.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#71717a' }}>
              No photos in gallery archive.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--space-4)'
            }}>
              {filteredGallery.map((img) => {
                const isSelected = selectedGalleryIds.includes(img.id);
                return (
                  <div key={`admin-gal-${img.id}`} style={{
                    backgroundColor: '#141417',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${isSelected ? '#ffffff' : '#27272a'}`,
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      zIndex: 3,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: '4px',
                      padding: '2px 4px'
                    }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectGallery(img.id)}
                        style={{ width: '15px', height: '15px', accentColor: '#ffffff', cursor: 'pointer' }}
                      />
                    </div>

                    <button
                      onClick={() => handleDeleteSingleGallery(img.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 3,
                        backgroundColor: 'rgba(20,20,23,0.85)',
                        border: '1px solid #7f1d1d',
                        borderRadius: '50%',
                        color: '#f87171',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Delete photo"
                    >
                      <Icon name="Trash2" size={13} />
                    </button>

                    <div style={{ height: '160px', width: '100%', backgroundColor: '#000000', overflow: 'hidden' }}>
                      <img src={img.url} alt={img.caption || 'Photo'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>

                    <div style={{ padding: 'var(--space-3)' }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: '#ffffff', marginBottom: '4px', lineHeight: 1.4 }}>
                        {img.caption || 'No caption'}
                      </p>
                      <span style={{ fontSize: '10px', color: '#71717a' }}>
                        Source: {img.source || 'Community'} • {img.createdAt || 'Recent'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 4: TIPS ===================== */}
      {activeTab === 'tips' && (
        <div style={{ backgroundColor: '#111113', borderRadius: 'var(--radius-xl)', border: '1px solid #27272a', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#ffffff' }}>
                Citizen Sighting Tips & Inquiries ({(tips || []).length})
              </h3>
              <span style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                Auto-syncs in real time with SQLite database
              </span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search tips or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #27272a',
                  backgroundColor: '#141417',
                  color: '#ffffff',
                  fontSize: 'var(--text-xs)'
                }}
              />

              {(tips || []).length > 0 && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: 'var(--text-xs)', color: '#ffffff' }}>
                    <input
                      type="checkbox"
                      checked={selectedTipIds.length === filteredTips.length && filteredTips.length > 0}
                      onChange={toggleSelectAllTips}
                      style={{ width: '15px', height: '15px', accentColor: '#ffffff' }}
                    />
                    <span>Select All ({selectedTipIds.length}/{filteredTips.length})</span>
                  </label>

                  {selectedTipIds.length > 0 && (
                    <Button variant="danger" size="sm" onClick={handleDeleteSelectedTips}>
                      Delete Selected ({selectedTipIds.length})
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleDeleteAllTips} style={{ color: '#ef4444', borderColor: '#7f1d1d' }}>
                    Delete All Tips
                  </Button>
                </div>
              )}
            </div>
          </div>

          {filteredTips.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#71717a' }}>
              No information tips in database.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {filteredTips.map((t: any, idx: number) => {
                const uniqueKey = t && t.id ? `tip-item-${t.id}` : `tip-item-fallback-${idx}`;
                const isSelected = selectedTipIds.includes(t.id);
                return (
                  <div key={uniqueKey} style={{
                    padding: 'var(--space-4)',
                    backgroundColor: isSelected ? '#18181f' : '#141417',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${isSelected ? '#ffffff' : '#27272a'}`,
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectTip(t.id)}
                      style={{ width: '16px', height: '16px', marginTop: '4px', accentColor: '#ffffff', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#ffffff', marginRight: '8px' }}>
                            Case: {t.caseId}
                          </span>
                          <Badge variant="status" status={t.status === 'reviewed' ? 'found-safe' : 'missing'} size="sm">
                            {(t.status || 'new').toUpperCase()}
                          </Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>
                            {t.createdAt}
                          </span>
                          <button
                            onClick={() => handleDeleteTip(t.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#71717a',
                              cursor: 'pointer',
                              padding: '2px 4px'
                            }}
                            title="Delete tip"
                          >
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                      <p style={{ color: '#ffffff', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', lineHeight: 1.5 }}>
                        {t.tipText}
                      </p>
                      {t.contactInfo && (
                        <div style={{ fontSize: 'var(--text-xs)', color: '#a1a1aa' }}>
                          Contact provided: <strong style={{ color: '#ffffff' }}>{t.contactInfo}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 5: EXPORT & FACTORY WIPE ===================== */}
      {activeTab === 'export' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          <div style={{
            padding: 'var(--space-6)',
            backgroundColor: '#111113',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #27272a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
              <Icon name="FileSpreadsheet" size={28} style={{ color: '#ffffff' }} />
              <div>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff' }}>CSV Spreadsheet Export</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>RFC 4180 with UTF-8 BOM encoding</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#a1a1aa', marginBottom: 'var(--space-4)' }}>
              Download all missing persons and found records in standard tabular CSV format for importing into Excel, Google Sheets, or disaster management portals.
            </p>
            <Button variant="primary" fullWidth onClick={() => exportToCsv(cases, `findmyfamily-all-cases-${Date.now()}.csv`)}>
              Download CSV Dataset
            </Button>
          </div>

          <div style={{
            padding: 'var(--space-6)',
            backgroundColor: '#111113',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #27272a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
              <Icon name="Code" size={28} style={{ color: '#ffffff' }} />
              <div>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff' }}>JSON API Export</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>Structured JSON Schema format</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#a1a1aa', marginBottom: 'var(--space-4)' }}>
              Export complete structured JSON objects including coordinates, features, timestamps, and reporter information for developers and automated rescue bots.
            </p>
            <Button variant="primary" fullWidth onClick={() => exportToJson(cases, `findmyfamily-all-cases-${Date.now()}.json`)}>
              Download JSON Dataset
            </Button>
          </div>

          <div style={{
            padding: 'var(--space-6)',
            backgroundColor: '#111113',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #27272a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
              <Icon name="Printer" size={28} style={{ color: '#ffffff' }} />
              <div>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#ffffff' }}>Printable Disaster Dossier (PDF)</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: '#71717a' }}>Print / Save as PDF</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#a1a1aa', marginBottom: 'var(--space-4)' }}>
              Generates a formatted, high-density disaster roster ready for physical printing or PDF saving for ground search teams with zero power/internet.
            </p>
            <Button variant="secondary" fullWidth onClick={() => printOrSavePdf(cases, 'Find My Family — Complete Emergency Roster')}>
              Open Printable Report
            </Button>
          </div>

          <div style={{
            padding: 'var(--space-6)',
            backgroundColor: '#160b0b',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #7f1d1d'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
              <Icon name="AlertTriangle" size={28} style={{ color: '#ef4444' }} />
              <div>
                <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', color: '#f87171' }}>Permanent Factory Wipe</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: '#fca5a5' }}>Complete Hard Reset & Disk Vacuum</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#fca5a5', marginBottom: 'var(--space-4)' }}>
              Permanently purges all cases, tips, sighting inquiries, gallery photos, and community posts from the physical database file and reclaims storage space.
            </p>
            <Button
              variant="danger"
              fullWidth
              loading={isBulkDeleting}
              onClick={handleHardPurgeAllData}
              icon={<Icon name="Trash2" size={16} />}
            >
              Permanent Wipe (Hard Delete All)
            </Button>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {editingCase && (
        <EditCaseModal
          isOpen={!!editingCase}
          onClose={() => setEditingCase(null)}
          caseData={editingCase}
          onSave={handleSaveEditedCase}
          onDelete={handleDeleteCase}
        />
      )}
    </div>
  );
};
