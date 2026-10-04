'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateImpactScore } from '@/lib/ai-engine';
import { PriorityBadge } from '@/components/priority-badge';
import { MapPin, Upload, Sparkles, Building, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Garbage / Waste');
  const [latitude, setLatitude] = useState('18.5204');
  const [longitude, setLongitude] = useState('73.8567');
  const [imageUrl, setImageUrl] = useState('');
  const [severity, setSeverity] = useState('4');
  const [environmentalImpact, setEnvironmentalImpact] = useState('4');
  const [peopleAffected, setPeopleAffected] = useState('4');
  const [urgency, setUrgency] = useState('4');
  const [submitting, setSubmitting] = useState(false);

  // Preset location hotspots for easy hackathon demo selection
  const locationPresets = [
    { label: 'XYZ Road (City High School Zone)', lat: '18.5204', lon: '73.8567' },
    { label: 'MG Road Junction (Central Mall)', lat: '18.5284', lon: '73.8741' },
    { label: 'Market Square Sidewalk', lat: '18.5312', lon: '73.8489' },
    { label: 'Park Avenue Pipeline', lat: '18.5098', lon: '73.8321' },
    { label: 'Industrial Plot (Sector 4)', lat: '18.5401', lon: '73.8612' },
  ];

  // Preset image samples for quick testing
  const imagePresets = [
    { label: 'Garbage Heap Photo', url: 'https://images.unsplash.com/photo-1605600659908-0ef7693a4ca8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Road Pothole Photo', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
    { label: 'Drainage Overflow Photo', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80' },
    { label: 'Water Leakage Photo', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80' },
  ];

  // Real-time AI preview calculation
  const aiPreview = calculateImpactScore({
    title: title || 'Civic Complaint Title',
    description: description || 'Civic complaint description',
    category,
    latitude: parseFloat(latitude) || 18.5204,
    longitude: parseFloat(longitude) || 73.8567,
    severity: parseInt(severity),
    environmentalImpact: parseInt(environmentalImpact),
    peopleAffected: parseInt(peopleAffected),
    urgency: parseInt(urgency),
    communitySupport: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          imageUrl: imageUrl || imagePresets[0].url,
          severity,
          environmentalImpact,
          peopleAffected,
          urgency,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        router.push(`/issues/${created.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Report a Civic Issue
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Submit details and photo. The AI Impact Engine will analyze impact score, route to authority, and check for duplicate clusters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Issue Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Garbage / Waste">Garbage / Waste Hotspot / Illegal Dumping</option>
              <option value="Pothole / Road Damage">Pothole / Road Damage / Asphalt Failure</option>
              <option value="Broken Streetlight">Broken Streetlight / Electrical Hazard</option>
              <option value="Blocked Drainage">Blocked Drainage / Sewage Overflow</option>
              <option value="Water Leakage">Water Pipe Leakage / Supply Burst</option>
              <option value="Open Waste Burning">Open Waste / Plastic Burning</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Issue Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Garbage hotspot near school gate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the issue, exact landmark, and observed impact on residents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Location Selector */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                <span>Geolocation Coordinates *</span>
              </label>
              <span className="text-xs text-slate-500">Pick preset or enter lat/lon</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {locationPresets.map((loc) => (
                <button
                  type="button"
                  key={loc.label}
                  onClick={() => {
                    setLatitude(loc.lat);
                    setLongitude(loc.lon);
                  }}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    latitude === loc.lat && longitude === loc.lon
                      ? 'bg-emerald-700 text-white font-bold border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Image Upload / Preset Photo Picker */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-md border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Upload className="w-4 h-4 mr-1 text-emerald-600" />
              <span>Attach Image Proof URL</span>
            </label>
            <input
              type="url"
              placeholder="Paste photo image URL or select sample below"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {imagePresets.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className="px-2 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-100"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Factor Sliders */}
          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Severity & Urgency Self-Assessment (1 to 5)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-600 block">Severity: {severity}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-slate-600 block">Environmental: {environmentalImpact}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={environmentalImpact}
                  onChange={(e) => setEnvironmentalImpact(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-slate-600 block">People Impact: {peopleAffected}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <span className="text-slate-600 block">Urgency: {urgency}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Analysing & Registering...' : 'Submit Issue to Authority'}</span>
          </button>
        </form>

        {/* Live AI Engine Preview Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 space-y-4 sticky top-20">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm tracking-tight">Live AI Engine Evaluation</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Department:</span>
                <span className="font-bold text-emerald-400 flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1" />
                  {aiPreview.department}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calculated Impact:</span>
                <span className="font-bold text-slate-100 text-lg">
                  {aiPreview.impactScore.toFixed(0)} / 100
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Priority Level:</span>
                <PriorityBadge priority={aiPreview.priority} size="sm" />
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                <span className="text-slate-400 font-mono text-[10px] block uppercase">AI Explanation</span>
                <p className="text-slate-300 leading-relaxed font-sans">{aiPreview.aiExplanation}</p>
              </div>

              <div className="bg-purple-950/60 p-3 rounded border border-purple-800/80 space-y-1 text-purple-200">
                <span className="font-mono text-[10px] font-bold block uppercase text-purple-300">
                  Duplicate Cluster Check
                </span>
                <p className="leading-snug">
                  If another issue exists within ~350m of ({latitude}, {longitude}), it will be automatically merged into a Unified Issue Cluster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
