import type { ResumeData } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

interface Props { data: ResumeData }

function ProfessionalTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications, achievements } = data

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 12, color: '#1a1a1a', width: 794, minHeight: 1123, boxSizing: 'border-box', background: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#1e3a5f', color: '#fff', padding: '40px 20px', flexShrink: 0 }}>
        <h1 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', lineHeight: 1.3, color: '#fff' }}>{contact.name}</h1>
        <p style={{ fontSize: 11, color: '#93c5fd', margin: '0 0 20px' }}>{data.target_role}</p>

        <SideSection title="Contact">
          {contact.email && <p style={sideText}>{contact.email}</p>}
          {contact.phone && <p style={sideText}>{contact.phone}</p>}
          {contact.location && <p style={sideText}>{contact.location}</p>}
          {contact.linkedin && <p style={{ ...sideText, color: '#93c5fd', wordBreak: 'break-all' }}>{contact.linkedin}</p>}
          {contact.portfolio && <p style={{ ...sideText, color: '#93c5fd', wordBreak: 'break-all' }}>{contact.portfolio}</p>}
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.map((s, i) => (
              <p key={i} style={{ ...sideText, marginBottom: 3 }}>• {s}</p>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((c, i) => (
              <p key={i} style={{ ...sideText, marginBottom: 3 }}>• {c}</p>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '40px 36px' }}>
        {summary && (
          <MainSection title="Professional Summary">
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>{summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Work Experience">
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 12 }}>{exp.title}</strong>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{exp.duration}</span>
                </div>
                <div style={{ color: '#1e3a5f', fontStyle: 'italic', marginBottom: 4, fontSize: 11 }}>{exp.company}</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 2, lineHeight: 1.5, color: '#374151' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education">
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{edu.degree}</strong>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{edu.year}</span>
                </div>
                <div style={{ color: '#1e3a5f', fontStyle: 'italic', fontSize: 11 }}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</div>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <strong>{p.name}</strong>
                <p style={{ margin: '2px 0 0', color: '#374151', fontSize: 11 }}>{p.description}</p>
              </div>
            ))}
          </MainSection>
        )}

        {achievements.length > 0 && (
          <MainSection title="Achievements">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {achievements.map((a, i) => <li key={i} style={{ marginBottom: 2, color: '#374151' }}>{a}</li>)}
            </ul>
          </MainSection>
        )}
      </div>
    </div>
  )
}

const sideText: React.CSSProperties = { fontSize: 10, color: '#e2e8f0', margin: '0 0 4px', lineHeight: 1.4 }

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#93c5fd', borderBottom: '1px solid #3b5a8a', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: 3, marginBottom: 8, marginTop: 0 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

ProfessionalTemplate.config = {
  id: 'professional',
  name: 'Professional',
  roleTypes: ['Manager', 'Analyst', 'Consultant', 'Business'],
  atsOptimised: false,
} as TemplateConfig

export default ProfessionalTemplate
