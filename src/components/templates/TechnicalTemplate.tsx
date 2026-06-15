import type { ResumeData } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

interface Props { data: ResumeData }

function TechnicalTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#1a1a1a', width: 794, minHeight: 1123, padding: '48px 56px', boxSizing: 'border-box', background: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>{contact.name}</h1>
        <div style={{ marginTop: 4, color: '#4b5563', fontSize: 11, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.portfolio && <span>{contact.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <Section title="Summary">
          <p style={{ margin: 0, lineHeight: 1.6 }}>{summary}</p>
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Technical Skills">
          <p style={{ margin: 0 }}>{skills.join(' · ')}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{exp.title}</strong>
                <span style={{ color: '#6b7280', fontSize: 11 }}>{exp.duration}</span>
              </div>
              <div style={{ color: '#4b5563', marginBottom: 4 }}>{exp.company}</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {exp.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: 2, lineHeight: 1.5 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong>{p.link && <span style={{ color: '#2563eb', marginLeft: 8, fontSize: 11 }}>{p.link}</span>}
              <p style={{ margin: '2px 0 0', color: '#4b5563' }}>{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{edu.degree}</strong>
                <span style={{ color: '#6b7280', fontSize: 11 }}>{edu.year}</span>
              </div>
              <div style={{ color: '#4b5563' }}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</div>
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {certifications.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Section title="Achievements">
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {achievements.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563eb', borderBottom: '1px solid #bfdbfe', paddingBottom: 2, marginBottom: 6, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

TechnicalTemplate.config = {
  id: 'technical',
  name: 'Technical',
  roleTypes: ['Software Engineer', 'Developer', 'Data Scientist', 'DevOps'],
  atsOptimised: true,
} as TemplateConfig

export default TechnicalTemplate
