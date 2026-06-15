import type { ResumeData } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

interface Props { data: ResumeData }

function GeneralTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#111827', width: 794, minHeight: 1123, padding: '48px 56px', boxSizing: 'border-box', background: '#fff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #111827' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{contact.name}</h1>
        <p style={{ fontSize: 12, color: '#374151', margin: '0 0 8px' }}>{data.target_role}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 10, color: '#6b7280', flexWrap: 'wrap' }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.portfolio && <span>{contact.portfolio}</span>}
        </div>
      </div>

      {summary && (
        <Section title="Profile Summary">
          <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Professional Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700 }}>{exp.title}</span>
                <span style={{ fontSize: 10, color: '#6b7280' }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: 11, color: '#374151', marginBottom: 4, fontStyle: 'italic' }}>{exp.company}</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {exp.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: 2, lineHeight: 1.5 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p style={{ margin: 0, lineHeight: 1.8 }}>{skills.join(' • ')}</p>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.degree}</span>
                <span style={{ color: '#374151', marginLeft: 8 }}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</span>
              </div>
              <span style={{ fontSize: 10, color: '#6b7280', flexShrink: 0, marginLeft: 12 }}>{edu.year}</span>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              {p.link && <span style={{ fontSize: 10, color: '#6b7280', marginLeft: 8 }}>{p.link}</span>}
              <p style={{ margin: '2px 0 0', color: '#374151', lineHeight: 1.5 }}>{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {certifications.map((c, i) => <li key={i} style={{ marginBottom: 2 }}>{c}</li>)}
          </ul>
        </Section>
      )}

      {achievements.length > 0 && (
        <Section title="Achievements">
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {achievements.map((a, i) => <li key={i} style={{ marginBottom: 2 }}>{a}</li>)}
          </ul>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#111827', borderBottom: '1px solid #d1d5db', paddingBottom: 3, marginBottom: 8, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

GeneralTemplate.config = {
  id: 'general',
  name: 'General',
  roleTypes: ['Any Role', 'Administrative', 'Operations'],
  atsOptimised: true,
} as TemplateConfig

export default GeneralTemplate
