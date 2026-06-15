import type { ResumeData } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

interface Props { data: ResumeData }

function FresherTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div style={{ fontFamily: '"Segoe UI", Arial, sans-serif', fontSize: 12, color: '#1a1a1a', width: 794, minHeight: 1123, boxSizing: 'border-box', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: '#0d9488', padding: '32px 48px', color: '#fff' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px', color: '#fff' }}>{contact.name}</h1>
        <p style={{ fontSize: 13, margin: '0 0 12px', color: '#ccfbf1' }}>{data.target_role}</p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 10, color: '#f0fdfa' }}>
          {contact.email && <span>✉ {contact.email}</span>}
          {contact.phone && <span>☎ {contact.phone}</span>}
          {contact.location && <span>⌂ {contact.location}</span>}
          {contact.linkedin && <span>in {contact.linkedin}</span>}
          {contact.portfolio && <span>↗ {contact.portfolio}</span>}
        </div>
      </div>

      <div style={{ padding: '28px 48px' }}>
        {summary && (
          <FresherSection title="Objective">
            <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{summary}</p>
          </FresherSection>
        )}

        {skills.length > 0 && (
          <FresherSection title="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.map((s, i) => (
                <span key={i} style={{ background: '#f0fdfa', color: '#0d9488', padding: '3px 10px', borderRadius: 4, fontSize: 10, border: '1px solid #99f6e4' }}>
                  {s}
                </span>
              ))}
            </div>
          </FresherSection>
        )}

        {education.length > 0 && (
          <FresherSection title="Education">
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{edu.degree}</strong>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{edu.year}</span>
                </div>
                <div style={{ color: '#0d9488', marginBottom: 2 }}>{edu.institution}</div>
                {edu.grade && <div style={{ fontSize: 10, color: '#6b7280' }}>Grade: {edu.grade}</div>}
              </div>
            ))}
          </FresherSection>
        )}

        {projects.length > 0 && (
          <FresherSection title="Projects">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: '3px solid #99f6e4' }}>
                <strong style={{ color: '#0d9488' }}>{p.name}</strong>
                {p.link && <span style={{ fontSize: 10, color: '#6b7280', marginLeft: 8 }}>{p.link}</span>}
                <p style={{ margin: '3px 0 0', color: '#374151', lineHeight: 1.5 }}>{p.description}</p>
              </div>
            ))}
          </FresherSection>
        )}

        {experience.length > 0 && (
          <FresherSection title="Experience">
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{exp.title}</strong>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{exp.duration}</span>
                </div>
                <div style={{ color: '#0d9488', marginBottom: 4 }}>{exp.company}</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 2, lineHeight: 1.5, color: '#374151' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </FresherSection>
        )}

        {achievements.length > 0 && (
          <FresherSection title="Achievements">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {achievements.map((a, i) => <li key={i} style={{ marginBottom: 2, color: '#374151' }}>{a}</li>)}
            </ul>
          </FresherSection>
        )}

        {certifications.length > 0 && (
          <FresherSection title="Certifications">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {certifications.map((c, i) => <li key={i} style={{ marginBottom: 2, color: '#374151' }}>{c}</li>)}
            </ul>
          </FresherSection>
        )}
      </div>
    </div>
  )
}

function FresherSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0d9488', borderBottom: '2px solid #0d9488', paddingBottom: 3, marginBottom: 8, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

FresherTemplate.config = {
  id: 'fresher',
  name: 'Fresher',
  roleTypes: ['Graduate', 'Intern', 'Entry Level', 'Trainee'],
  atsOptimised: true,
} as TemplateConfig

export default FresherTemplate
