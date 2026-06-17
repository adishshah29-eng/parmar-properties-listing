"use client";

import React, { useState, useEffect } from "react";
import { Database } from "@/types/supabase";

type Developer = Database['public']['Tables']['developers']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Configuration = Database['public']['Tables']['configurations']['Row'];
type Inventory = Database['public']['Tables']['inventory']['Row'];
type FloorPlan = Database['public']['Tables']['floor_plans']['Row'];
type ProjectImage = Database['public']['Tables']['project_images']['Row'];

interface DeveloperNode extends Developer {
  projects: ProjectNode[];
}

interface ProjectNode extends Project {
  images: ProjectImage[];
  configurations: ConfigurationNode[];
}

interface ConfigurationNode extends Configuration {
  floorPlans: FloorPlan[];
  inventory: Inventory[];
}

interface SystemVisualizerProps {
  initialDevelopers: DeveloperNode[];
  stats: {
    developers: number;
    projects: number;
    configurations: number;
    inventory: number;
  };
}

const SystemVisualizer: React.FC<SystemVisualizerProps> = ({ initialDevelopers, stats }) => {
  const [selectedNode, setSelectedNode] = useState<{ type: string; id: string } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Parent lookup maps (re-create on data change)
  const projectParent: { [key: string]: string } = {};
  const configParent: { [key: string]: { projId: string; devId: string } } = {};
  const fpParent: { [key: string]: string } = {};
  const invParent: { [key: string]: string } = {};

  useEffect(() => {
    initialDevelopers.forEach(dev => {
      dev.projects.forEach(proj => {
        projectParent[proj.id] = dev.id;
        proj.configurations.forEach(cfg => {
          configParent[cfg.id] = { projId: proj.id, devId: dev.id };
          cfg.floorPlans.forEach(fp => (fpParent[fp.id] = cfg.id));
          cfg.inventory.forEach(inv => (invParent[inv.id] = cfg.id));
        });
      });
    });
  }, [initialDevelopers]);

  const findDev = (id: string) => initialDevelopers.find(d => d.id === id);
  const findProj = (id: string) => {
    for (const d of initialDevelopers) {
      const p = d.projects.find(p => p.id === id);
      if (p) return p;
    }
    return undefined;
  };
  const findCfg = (id: string) => {
    for (const d of initialDevelopers) {
      for (const p of d.projects) {
        const c = p.configurations.find(c => c.id === id);
        if (c) return c;
      }
    }
    return undefined;
  };
  const findFp = (id: string) => {
    for (const d of initialDevelopers) {
      for (const p of d.projects) {
        for (const c of p.configurations) {
          const f = c.floorPlans.find(f => f.id === id);
          if (f) return f;
        }
      }
    }
    return undefined;
  };
  const findInv = (id: string) => {
    for (const d of initialDevelopers) {
      for (const p of d.projects) {
        for (const c of p.configurations) {
          const i = c.inventory.find(i => i.id === id);
          if (i) return i;
        }
      }
    }
    return undefined;
  };

  const fmtINR = (num: number) => {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(2).replace(/\.00$/, '') + ' Lac';
    return '₹' + num.toLocaleString('en-IN');
  };

  const onRowClick = (event: React.MouseEvent, type: string, id: string, expandable: boolean) => {
    event.stopPropagation();
    setSelectedNode({ type, id });
    if (expandable) {
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  };

  const renderDevDetail = (dev: DeveloperNode) => {
    const initials = dev.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return (
      <>
        <span className="detail-badge dev">DEVELOPER</span>
        <div className="detail-hero">
          <div className="dev-logo">{initials}</div>
          <div>
            <div className="detail-title" style={{ marginTop: 0 }}>{dev.name}</div>
            <div className="detail-sub">{dev.projects.length} active project{dev.projects.length > 1 ? 's' : ''} · Logo placeholder shown above</div>
          </div>
        </div>
        <div className="detail-grid">
          <div className="detail-field"><div className="f-label">Website</div><div className="f-value"><a href={dev.website || "#"} target="_blank" rel="noopener noreferrer">{dev.website || "N/A"}</a></div></div>
          <div className="detail-field"><div className="f-label">Established Year</div><div className="f-value mono">{dev.established || "N/A"}</div></div>
        </div>
      </>
    );
  };

  const renderProjDetail = (proj: ProjectNode, dev: DeveloperNode | undefined) => {
    const amenitiesArray = proj.amenities ? proj.amenities.split(',').map(a => a.trim()) : [];
    return (
      <>
        <span className="detail-badge proj">PROJECT</span>
        <div className="detail-title">{proj.name}</div>
        <div className="detail-sub">by {dev?.name} · {proj.location}</div>
        <p className="detail-desc">{proj.description}</p>
        <div className="detail-grid">
          <div className="detail-field"><div className="f-label">Location</div><div className="f-value">{proj.location}</div></div>
          <div className="detail-field"><div className="f-label">Configurations</div><div className="f-value mono">{proj.configurations.length}</div></div>
        </div>
        <div className="detail-section-label">Amenities</div>
        <div className="detail-amenities">{amenitiesArray.map((a, i) => <span key={i}>{a}</span>)}</div>
        <div className="detail-section-label">Images, Files &amp; Links</div>
        <div className="detail-files">{proj.images.map((f, i) => <a key={i} href={f.url} target="_blank" rel="noopener noreferrer">📎 {f.label || `Image ${i + 1}`}</a>)}</div>
      </>
    );
  };

  const renderCfgDetail = (cfg: ConfigurationNode, proj: ProjectNode | undefined) => {
    const total = cfg.carpetArea * cfg.pricePerSqft; // Changed from cfg.rate to cfg.pricePerSqft
    return (
      <>
        <span className="detail-badge cfg">CONFIGURATION</span>
        <div className="detail-title">{cfg.variantName}</div> {/* Changed from cfg.variant to cfg.variantName */}
        <div className="detail-sub">{proj?.name} · {cfg.bhk} BHK · {cfg.status}</div>
        <div className="detail-grid">
          <div className="detail-field"><div className="f-label">BHK</div><div className="f-value mono">{cfg.bhk} BHK</div></div>
          <div className="detail-field"><div className="f-label">Carpet Area</div><div className="f-value mono">{cfg.carpetArea.toLocaleString('en-IN')} sq ft</div></div>
          <div className="detail-field"><div className="f-label">Rate (₹ / sq ft)</div><div className="f-value mono">₹{cfg.pricePerSqft.toLocaleString('en-IN')}</div></div> {/* Changed from cfg.rate to cfg.pricePerSqft */}
          <div className="detail-field"><div className="f-label">RERA ID</div><div className="f-value mono">{cfg.reraId || "N/A"}</div></div>
          <div className="detail-field"><div className="f-label">Possession Date</div><div className="f-value mono">{cfg.possessionDate ? new Date(cfg.possessionDate).toLocaleDateString('en-IN') : "N/A"}</div></div> {/* Changed to possessionDate and formatted */}
          <div className="detail-field"><div className="f-label">Total Price (auto-computed)</div><div className="f-value mono total-price">{fmtINR(total)}</div></div>
        </div>
      </>
    );
  };

  const renderFpDetail = (fp: FloorPlan, cfg: ConfigurationNode | undefined) => {
    return (
      <>
        <span className="detail-badge fp">FLOOR PLAN</span>
        <div className="detail-title">{fp.label}</div>
        <div className="detail-sub">{cfg?.variantName}</div> {/* Changed from cfg.variant to cfg.variantName */}
        <div className="detail-grid">
          <div className="detail-field"><div className="f-label">Layout Type</div><div className="f-value">{fp.type}</div></div> {/* Changed from layoutType to type */}
          <div className="detail-field"><div className="f-label">Custom Label</div><div className="f-value">{fp.label}</div></div>
        </div>
        <div className="detail-section-label">Floor Plan Image</div>
        <div className="detail-files"><a href={fp.url} target="_blank" rel="noopener noreferrer">🖼 View Floor Plan Image</a></div> {/* Changed from imageUrl to url */}
      </>
    );
  };

  const renderInvDetail = (inv: Inventory, cfg: ConfigurationNode | undefined) => {
    const statusClass = inv.status.toLowerCase();
    const overrideText = inv.priceOverride ? fmtINR(inv.priceOverride) + ' premium over base configuration price' : 'No override — base configuration price applies';
    return (
      <>
        <span className="detail-badge inv">INVENTORY UNIT</span>
        <div className="detail-title">Unit {inv.unitNumber}</div>
        <div className="detail-sub">{cfg?.variantName}</div> {/* Changed from cfg.variant to cfg.variantName */}
        <div style={{ margin: '16px 0 4px', display: 'flex', alignItems: 'center' }}>
          <span className={`status-dot ${statusClass}`}></span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{inv.status}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-field"><div className="f-label">Unit Number</div><div className="f-value mono">{inv.unitNumber}</div></div>
          <div className="detail-field"><div className="f-label">Floor</div><div className="f-value mono">{inv.floor}</div></div>
          <div className="detail-field"><div className="f-label">Facing</div><div className="f-value">{inv.facing || "N/A"}</div></div>
          <div className="detail-field"><div className="f-label">Price Override</div><div className="f-value mono">{overrideText}</div></div>
        </div>
        <div className="detail-section-label">Notes</div>
        <div className="detail-notes">{inv.notes || '—'}</div>
      </>
    );
  };

  const renderDetail = () => {
    if (!selectedNode) {
      return <div className="empty-state">Select any node in the hierarchy tree<br/>to view its complete details here.</div>;
    }
    const { type, id } = selectedNode;
    let detailContent;
    if (type === 'dev') {
      const dev = findDev(id);
      detailContent = dev ? renderDevDetail(dev) : null;
    } else if (type === 'proj') {
      const proj = findProj(id);
      const dev = proj ? findDev(projectParent[id]) : undefined;
      detailContent = proj && dev ? renderProjDetail(proj, dev) : null;
    } else if (type === 'cfg') {
      const cfg = findCfg(id);
      const proj = cfg ? findProj(configParent[id]?.projId) : undefined;
      detailContent = cfg && proj ? renderCfgDetail(cfg, proj) : null;
    } else if (type === 'fp') {
      const fp = findFp(id);
      const cfg = fp ? findCfg(fpParent[id]) : undefined;
      detailContent = fp && cfg ? renderFpDetail(fp, cfg) : null;
    } else if (type === 'inv') {
      const inv = findInv(id);
      const cfg = inv ? findCfg(invParent[id]) : undefined;
      detailContent = inv && cfg ? renderInvDetail(inv, cfg) : null;
    }
    return detailContent;
  };

  const buildFpLeaf = (fp: FloorPlan) => (
    <div key={fp.id} className={`tree-row ${selectedNode?.id === fp.id ? 'selected' : ''}`} onClick={(e) => onRowClick(e, 'fp', fp.id, false)}>
      <span className="tree-chevron"></span>
      <span className="tree-badge fp">FLOOR PLAN</span>
      <span className="tree-label">{fp.label}</span>
    </div>
  );

  const buildInvLeaf = (inv: Inventory) => (
    <div key={inv.id} className={`tree-row ${selectedNode?.id === inv.id ? 'selected' : ''}`} onClick={(e) => onRowClick(e, 'inv', inv.id, false)}>
      <span className="tree-chevron"></span>
      <span className="tree-badge inv">INVENTORY</span>
      <span className="tree-label">Unit {inv.unitNumber}</span>
    </div>
  );

  const buildCfgNode = (cfg: ConfigurationNode) => {
    const isExpanded = expandedNodes.has(cfg.id);
    return (
      <div key={cfg.id}>
        <div className={`tree-row ${selectedNode?.id === cfg.id ? 'selected' : ''}`} onClick={(e) => onRowClick(e, 'cfg', cfg.id, true)}>
          <span className={`tree-chevron ${isExpanded ? 'open' : ''}`}>▸</span>
          <span className="tree-badge cfg">CONFIG</span>
          <span className="tree-label">{cfg.variantName}</span>
        </div>
        <div className={`tree-expand ${isExpanded ? 'open' : ''}`}>
          <div className="tree-pills">
            <span className="tree-pill">status: {cfg.status}</span>
            <span className="tree-pill">area: {cfg.carpetArea} sqft</span>
          </div>
          <div className="tree-children">
            {cfg.floorPlans.map(buildFpLeaf)}
            {cfg.inventory.map(buildInvLeaf)}
          </div>
        </div>
      </div>
    );
  };

  const buildProjNode = (proj: ProjectNode) => {
    const isExpanded = expandedNodes.has(proj.id);
    return (
      <div key={proj.id}>
        <div className={`tree-row ${selectedNode?.id === proj.id ? 'selected' : ''}`} onClick={(e) => onRowClick(e, 'proj', proj.id, true)}>
          <span className={`tree-chevron ${isExpanded ? 'open' : ''}`}>▸</span>
          <span className="tree-badge proj">PROJECT</span>
          <span className="tree-label">{proj.name}</span>
        </div>
        <div className={`tree-expand ${isExpanded ? 'open' : ''}`}>
          <div className="tree-pills">
            <span className="tree-pill">location: {proj.location}</span>
            <span className="tree-pill">configs: {proj.configurations.length}</span>
          </div>
          <div className="tree-children">
            {proj.configurations.map(buildCfgNode)}
          </div>
        </div>
      </div>
    );
  };

  const buildDevNode = (dev: DeveloperNode) => {
    const isExpanded = expandedNodes.has(dev.id);
    return (
      <div key={dev.id}>
        <div className={`tree-row ${selectedNode?.id === dev.id ? 'selected' : ''}`} onClick={(e) => onRowClick(e, 'dev', dev.id, true)}>
          <span className={`tree-chevron ${isExpanded ? 'open' : ''}`}>▸</span>
          <span className="tree-badge dev">DEVELOPER</span>
          <span className="tree-label">{dev.name}</span>
        </div>
        <div className={`tree-expand ${isExpanded ? 'open' : ''}`}>
          <div className="tree-pills">
            <span className="tree-pill">est: {dev.established || "N/A"}</span>
            <span className="tree-pill">projects: {dev.projects.length}</span>
          </div>
          <div className="tree-children">
            {dev.projects.map(buildProjNode)}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Default expanded state: dev1 -> proj1 -> cfg2 selected
    const defaultDevId = initialDevelopers[0]?.id;
    const defaultProjId = initialDevelopers[0]?.projects[0]?.id;
    const defaultCfgId = initialDevelopers[0]?.projects[0]?.configurations[1]?.id;

    if (defaultDevId) setExpandedNodes(prev => new Set(prev).add(defaultDevId));
    if (defaultProjId) setExpandedNodes(prev => new Set(prev).add(defaultProjId));
    if (defaultCfgId) setSelectedNode({ type: 'cfg', id: defaultCfgId });

  }, [initialDevelopers]);


  return (
    <div className="body-area">
      <div className="wrap">
        <div className="crumbs">Home &gt; Admin &gt; <b>System Visualizer</b></div>

        {/* Stats grid */}
        <div className="stats-grid">
          <div className="stat-card dev">
            <div className="s-icon-row"><div className="s-icon">D</div><span className="live-dot"></span></div>
            <div className="s-value mono">{stats.developers}</div>
            <div className="s-label">Developers</div>
          </div>
          <div className="stat-card proj">
            <div className="s-icon-row"><div className="s-icon">P</div><span className="live-dot"></span></div>
            <div className="s-value mono">{stats.projects}</div>
            <div className="s-label">Projects</div>
          </div>
          <div className="stat-card cfg">
            <div className="s-icon-row"><div className="s-icon">C</div><span className="live-dot"></span></div>
            <div className="s-value mono">{stats.configurations}</div>
            <div className="s-label">Configurations</div>
          </div>
          <div className="stat-card inv">
            <div className="s-icon-row"><div className="s-icon">U</div><span className="live-dot"></span></div>
            <div className="s-value mono">{stats.inventory}</div>
            <div className="s-label">Inventory Units</div>
          </div>
        </div>

        {/* Tree + Detail layout */}
        <div className="layout">
          <div className="panel-card">
            <div className="panel-head">
              <span>Data Hierarchy</span>
              <span className="legend">
                <span className="legend-dot" style={{ background: "var(--gold)" }} title="Developer"></span>
                <span className="legend-dot" style={{ background: "var(--proj-text)" }} title="Project"></span>
                <span className="legend-dot" style={{ background: "var(--cfg-text)" }} title="Configuration"></span>
                <span className="legend-dot" style={{ background: "var(--fp-text)" }} title="Floor Plan"></span>
                <span className="legend-dot" style={{ background: "var(--inv-text)" }} title="Inventory"></span>
              </span>
            </div>
            <div className="tree-body">
              {initialDevelopers.map(buildDevNode)}
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-head"><span>Record Detail</span></div>
            <div className="detail-body">
              {renderDetail()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemVisualizer;
