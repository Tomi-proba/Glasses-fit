import { useLocalStorage } from './hooks/useLocalStorage'
import { SAMPLE_CV, EMPTY_CV } from './data/sampleData'
import { TEMPLATES } from './data/templates'
import { Editor } from './components/editor/Editor'
import { TemplateGallery } from './components/TemplateGallery'
import { PreviewPane } from './components/PreviewPane'
import type { CVData, TemplateId } from './types'

function App() {
  const [data, setData] = useLocalStorage<CVData>('cv-builder:data', SAMPLE_CV)
  const [templateId, setTemplateId] = useLocalStorage<TemplateId>('cv-builder:template', 'minimal')

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="no-print border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">CV Builder</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {activeTemplate?.name} template — everything stays in your browser
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm('Clear all your CV data and start from a blank template?')) setData(EMPTY_CV)
              }}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Start blank
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Save as PDF
            </button>
          </div>
        </div>
      </header>

      <div className="no-print border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl">
          <TemplateGallery selected={templateId} onSelect={setTemplateId} />
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-2">
        <div className="no-print max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          <Editor data={data} onChange={setData} />
        </div>
        <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-220px)]">
          <PreviewPane data={data} templateId={templateId} />
        </div>
      </main>
    </div>
  )
}

export default App
