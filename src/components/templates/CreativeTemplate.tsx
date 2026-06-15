import type { ResumeData } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

interface Props { data: ResumeData }

function CreativeTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif', fontSize: 12, color: '#1a1a1a', width: 794, minHeight: 1123, boxSizing: 'border-box', background: '#fff' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)', padding: '36px 48px', color: '#fff' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{contact.name}</h1>
        <p style={{ fontSize: 14, margin: '4px 0 12px', opacity: 0.9 }}>{data.target_role}</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, opacity: 0.85 }}>
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>☎ {contact.phone}</span>}
          {contact.location && <span>⌂ {contact.location}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.portfolio && <span>↗ {contact.portfolio}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', padding: '28px 48px', gap: 32 }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {summary && (
            <CreativeSection title="About Me" accent="#7c3aed">
              <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{summary}</p>
            </CreativeSection>
          )}

          {experience.length > 0 && (
            <CreativeSection title="Experience" accent="#7c3aed">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: '3px solid #ede9fe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{exp.title}</strong>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{exp.duration}</span>
                  </div>
                  <div style={{ color: '#7c3aed', fontSize: 11, marginBottom: 4 }}>{exp.company}</div>
                  <ul style={{ margin: 0, paddingLeft: 14 }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: 2, lineHeight: 1.5, color: '#374151' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CreativeSection>
          )}

          {projects.length > 0 && (
            <CreativeSection title="Projects" accent="#db2777">
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 10, padding: '8px 10px', background: '#fdf4ff', borderRadius: 6 }}>
                  <strong style={{ color: '#7c3aed' }}>{p.name}</strong>
                  {p.link && <span style={{ fontSize: 10, color: '#db2777', marginLeft: 8 }}>{p.link}</span>}
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#4b5563' }}>{p.description}</p>
                </div>
              ))}
            </CreativeSection>
          )}
        </div>

        {/* Right column */}
        <div style={{ width: 180, flexShrink: 0 }}>
          {skills.length > 0 && (
            <CreativeSection title="Skills" accent="#db2777">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ background: '#fdf4ff', color: '#7c3aed', padding: '2px 8px', borderRadius: 12, fontSize: 10, border: '1px solid #ede9fe' }}>
                    {s}
                  </span>
                ))}
              </div>
            </CreativeSection>
          )}

          {education.length > 0 && (
            <CreativeSection title="Education" accent="#db2777">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: 11 }}>{edu.degree}</strong>
                  <p style={{ margin: '2px 0', fontSize: 10, color: '#7c3aed' }}>{edu.institution}</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#9ca3af' }}>{edu.year}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                </div>
              ))}
            </CreativeSection>
          )}

          {certifications.length > 0 && (
            <CreativeSection title="Certifications" accent="#db2777">
              {certifications.map((c, i) => (
                <p key={i} style={{ fontSize: 10, margin: '0 0 4px', color: '#374151' }}>✓ {c}</p>
              ))}
            </CreativeSection>
          )}

          {achievements.length > 0 && (
            <CreativeSection title="Achievements" accent="#7c3aed">
              {achievements.map((a, i) => (
                <p key={i} style={{ fontSize: 10, margin: '0 0 4px', color: '#374151' }}>★ {a}</p>
              ))}
            </CreativeSection>
          )}
        </div>
      </div>
    </div>
  )
}

function CreativeSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, marginBottom: 8, marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'inline-block', width: 16, height: 2, background: accent }}></span>
        {title}
      </h2>
      {children}
    </div>
  )
}

CreativeTemplate.config = {
  id: 'creative',
  name: 'Creative',
  roleTypes: ['Designer', 'UX', 'Marketing', 'Content'],
  atsOptimised: false,
} as TemplateConfig

export default CreativeTemplate
