import React, { useState } from 'react';
import { 
  GripVertical, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  EyeOff, 
  Lock, 
  Unlock, 
  SlidersHorizontal,
  Plus,
  Check
} from 'lucide-react';

import SpecimenDossierWidget from './widgets/SpecimenDossierWidget';
import SyntheticCoherenceWidget from './widgets/SyntheticCoherenceWidget';
import ConsensusRegistryWidget from './widgets/ConsensusRegistryWidget';
import SpectralArtifactsWidget from './widgets/SpectralArtifactsWidget';
import PropagationTrailWidget from './widgets/PropagationTrailWidget';
import BayesianArbitrationWidget from './widgets/BayesianArbitrationWidget';

export default function DraggableGrid({
  widgets,
  onReorderWidgets,
  onResetLayout,
  onToggleWidgetVisibility,
  currentCase,
  onSwitchCase,
  onExportDossier,
  onNewUpload,
  onPredictOriginal,
}) {
  const [draggedWidgetId, setDraggedWidgetId] = useState(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [expandedWidgetId, setExpandedWidgetId] = useState(null);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);

  // Drag and Drop handlers
  const handleDragStart = (e, widgetId) => {
    if (isLocked) return;
    setDraggedWidgetId(widgetId);
    e.dataTransfer.setData('text/plain', widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, widgetId) => {
    if (isLocked) return;
    e.preventDefault();
    if (draggedWidgetId && draggedWidgetId !== widgetId) {
      setDragOverWidgetId(widgetId);
    }
  };

  const handleDragLeave = (e, widgetId) => {
    if (dragOverWidgetId === widgetId) {
      setDragOverWidgetId(null);
    }
  };

  const handleDrop = (e, targetWidgetId) => {
    if (isLocked) return;
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetWidgetId) {
      setDraggedWidgetId(null);
      setDragOverWidgetId(null);
      return;
    }

    // Reorder array: move draggedWidget to targetWidget position
    const currentIndex = widgets.findIndex((w) => w.id === draggedWidgetId);
    const targetIndex = widgets.findIndex((w) => w.id === targetWidgetId);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updated = [...widgets];
      const [movedItem] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, movedItem);
      onReorderWidgets(updated);
    }

    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const handleDragEnd = () => {
    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  // Render individual forensic widget component by ID
  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'specimen-dossier':
      case 'runs-today':
        return (
          <SpecimenDossierWidget
            currentCase={currentCase}
            onSwitchCase={onSwitchCase}
            onExportDossier={onExportDossier}
            onNewUpload={onNewUpload}
            onPredictOriginal={onPredictOriginal}
          />
        );
      case 'synthetic-coherence':
      case 'system-status':
        return <SyntheticCoherenceWidget currentCase={currentCase} />;
      case 'consensus-registry':
      case 'total-cost':
        return <ConsensusRegistryWidget currentCase={currentCase} />;
      case 'spectral-artifacts':
      case 'errors':
        return <SpectralArtifactsWidget currentCase={currentCase} />;
      case 'propagation-trail':
      case 'recent-traces':
        return <PropagationTrailWidget currentCase={currentCase} />;
      case 'bayesian-verdict':
      case 'eval-score':
        return <BayesianArbitrationWidget currentCase={currentCase} />;
      default:
        return (
          <SpecimenDossierWidget
            currentCase={currentCase}
            onSwitchCase={onSwitchCase}
            onExportDossier={onExportDossier}
            onNewUpload={onNewUpload}
          />
        );
    }
  };

  // Filter only visible widgets unless expanded
  const visibleWidgets = widgets.filter((w) => w.visible);

  return (
    <div className="space-y-6 font-sans">
      {/* Main Draggable Grid Canvas */}
      {expandedWidgetId ? (
        /* Single Widget Expanded Full-Screen Mode */
        <div className="p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-zinc-200/60 shadow-xl relative text-zinc-900">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
            <span className="text-sm font-semibold text-zinc-900">
              {widgets.find((w) => w.id === expandedWidgetId)?.title || 'Expanded Module'}
            </span>
            <button
              onClick={() => setExpandedWidgetId(null)}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 cursor-pointer flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit fullscreen</span>
            </button>
          </div>
          <div>{renderWidgetContent(expandedWidgetId)}</div>
        </div>
      ) : (
        /* Multi-Widget Responsive Grid (6 Forensic Intelligence Widgets) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleWidgets.map((widget) => {
            const isDragging = draggedWidgetId === widget.id;
            const isDropTarget = dragOverWidgetId === widget.id;

            return (
              <div
                key={widget.id}
                draggable={!isLocked}
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={(e) => handleDragOver(e, widget.id)}
                onDragLeave={(e) => handleDragLeave(e, widget.id)}
                onDrop={(e) => handleDrop(e, widget.id)}
                onDragEnd={handleDragEnd}
                className={`${widget.defaultSpan} group relative rounded-3xl bg-white/80 backdrop-blur-xl border transition-all duration-200 select-none ${
                  isDragging
                    ? 'opacity-40 scale-[0.98] border-zinc-400 ring-2 ring-zinc-300 shadow-2xl'
                    : isDropTarget
                    ? 'border-dashed border-2 border-zinc-900 bg-zinc-50/80 scale-[1.01]'
                    : 'border-zinc-200/60 hover:border-zinc-300 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Drag Handle & Card Controls in Top-Right Corner */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Maximize Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedWidgetId(widget.id);
                    }}
                    className="p-1 rounded bg-white/90 border border-zinc-200 hover:border-zinc-400 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer shadow-2xs"
                    title="Maximize module"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>

                  {/* Hide Widget */}
                  {widget.removable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWidgetVisibility(widget.id);
                      }}
                      className="p-1 rounded bg-white/90 border border-zinc-200 hover:border-zinc-400 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer shadow-2xs"
                      title="Hide from dashboard"
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  )}

                  {/* Drag Handle */}
                  {!isLocked && (
                    <div
                      className="p-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 cursor-grab active:cursor-grabbing transition-colors"
                      title="Drag to rearrange"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Inner Card Content */}
                <div className="p-6 sm:p-7 h-full">
                  {renderWidgetContent(widget.id)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
