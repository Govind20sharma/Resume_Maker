import type { ResumeData } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

interface Props { data: ResumeData }

function ExecutiveTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: 12, color: '#1a1a1a', width: 794, minHeight: 1123, boxSizing: 'border-box', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: '#0f172a', padding: '36px 56px 28px', color: '#fff' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '0.5px', color: '#fff' }}>{contact.name}</h1>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 14px', fontStyle: 'italic' }}>{data.target_role}</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 10, color: '#cbd5e1' }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.portfolio && <span>{contact.portfolio}</span>}
        </div>
      </div>

      <div style={{ padding: '32px 56px' }}>
        {summary && (
          <ExecSection title="Executive Summary">
            <p style={{ margin: 0, lineHeight: 1.8, color: '#374151', fontStyle: 'italic' }}>{summary}</p>
          </ExecSection>
        )}

        {experience.length > 0 && (
          <ExecSection title="Professional Experience">
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #d1d5db', paddingBottom: 4, marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{exp.title}</span>
                    <span style={{ color: '#475569', marginLeft: 10, fontSize: 12 }}>{exp.company}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>{exp.duration}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 3, lineHeight: 1.6, color: '#374151' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ExecSection>
        )}

        {skills.length > 0 && (
          <ExecSection title="Core Competencies">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 0' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: 11, color: '#374151' }}>▸ {s}</span>
              ))}
            </div>
          </ExecSection>
        )}

        {achievements.length > 0 && (
          <ExecSection title="Key Achievements">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {achievements.map((a, i) => (
                <li key={i} style={{ marginBottom: 4, lineHeight: 1.6, color: '#374151' }}>{a}</li>
              ))}
            </ul>
          </ExecSection>
        )}

        {education.length > 0 && (
          <ExecSection title="Education">
            {education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{edu.degree}</span>
                  <span style={{ color: '#475569', marginLeft: 10 }}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</span>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0, marginLeft: 12 }}>{edu.year}</span>
              </div>
            ))}
          </ExecSection>
        )}

        {projects.length > 0 && (
          <ExecSection title="Notable Projects">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                {p.link && <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 8 }}>{p.link}</span>}
                <p style={{ margin: '2px 0 0', color: '#374151', lineHeight: 1.6 }}>{p.description}</p>
              </div>
            ))}
          </ExecSection>
        )}

        {certifications.length > 0 && (
          <ExecSection title="Certifications">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {certifications.map((c, i) => <li key={i} style={{ marginBottom: 2, color: '#374151' }}>{c}</li>)}
            </ul>
          </ExecSection>
        )}
      </div>
    </div>
  )
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: 3, marginBottom: 10, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

ExecutiveTemplate.config = {
  id: 'executive',
  name: 'Executive',
  roleTypes: ['VP', 'Director', 'C-Suite', 'Executive'],
  atsOptimised: true,
} as TemplateConfig

export default ExecutiveTemplate
