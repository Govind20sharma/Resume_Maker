'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resume-store'
import { resolveTemplates } from '@/lib/template-resolver'
import { TEMPLATE_MAP } from '@/components/templates'
import type { TemplateId } from '@/types/template'

const TEMPLATE_W = 794
const PREVIEW_H = 295

export default function TemplatePicker() {
  const router = useRouter()
  const resumeData = useResumeStore((s) => s.resumeData)
  const selectTemplate = useResumeStore((s) => s.selectTemplate)

  useEffect(() => {
    if (!resumeData) {
      router.replace('/')
    }
  }, [resumeData, router])

  if (!resumeData) return null

  const orderedIds = resolveTemplates(resumeData.target_role)

  function handleSelect(id: TemplateId) {
    selectTemplate(id)
    router.push('/editor')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h1>
          <p className="text-gray-500 text-sm">
            Select the design that best fits <span className="font-medium text-gray-700">{resumeData.target_role}</span>.
            You can edit your content after picking.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedIds.map((id) => {
            const TemplateComponent = TEMPLATE_MAP[id]
            const config = TemplateComponent.config
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className="group text-left border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {/* Live preview */}
                <div
                  className="overflow-hidden relative bg-white"
                  style={{ height: PREVIEW_H }}
                >
                  <div
                    style={{
                      width: TEMPLATE_W,
                      transformOrigin: 'top left',
                      transform: 'scale(0.33)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    <TemplateComponent data={resumeData} />
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-3 py-2.5 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-800 text-sm">{config.name}</span>
                    {config.atsOptimised && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5 whitespace-nowrap">
                        ATS-friendly
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {config.roleTypes.slice(0, 2).map((rt) => (
                      <span key={rt} className="text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5">
                        {rt}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
