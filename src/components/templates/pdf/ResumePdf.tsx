import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { ResumeData } from '@/types/resume'
import type { TemplateId } from '@/types/template'

const THEME: Record<TemplateId, string> = {
  technical: '#2563eb',
  professional: '#1e3a5f',
  creative: '#7c3aed',
  general: '#111827',
  executive: '#0f172a',
  fresher: '#0d9488',
}

interface Props {
  data: ResumeData
  templateId: TemplateId
}

export default function ResumePdf({ data, templateId }: Props) {
  const primary = THEME[templateId]

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      color: '#111827',
      paddingTop: 42,
      paddingBottom: 42,
      paddingLeft: 52,
      paddingRight: 52,
    },
    name: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 20,
      color: primary,
      marginBottom: 3,
    },
    role: {
      fontSize: 11,
      color: '#6b7280',
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9,
      color: '#6b7280',
      marginBottom: 2,
    },
    contactItem: {
      marginRight: 14,
    },
    sectionTitle: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: primary,
      borderBottomWidth: 1,
      borderBottomColor: primary,
      paddingBottom: 2,
      marginTop: 14,
      marginBottom: 6,
    },
    bodyText: {
      fontSize: 10,
      lineHeight: 1.6,
      color: '#374151',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    bold: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
    },
    meta: {
      fontSize: 9,
      color: '#6b7280',
    },
    entryWrap: {
      marginBottom: 9,
    },
    bulletRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    bulletDot: {
      width: 10,
      fontSize: 10,
      color: '#6b7280',
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 1.5,
      color: '#374151',
    },
    skillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillItem: {
      fontSize: 9,
      color: '#374151',
      marginRight: 10,
      marginBottom: 2,
    },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <Text style={styles.name}>{data.contact.name}</Text>
        <Text style={styles.role}>{data.target_role}</Text>
        <View style={styles.contactRow}>
          {data.contact.email ? <Text style={styles.contactItem}>{data.contact.email}</Text> : null}
          {data.contact.phone ? <Text style={styles.contactItem}>{data.contact.phone}</Text> : null}
          {data.contact.location ? <Text style={styles.contactItem}>{data.contact.location}</Text> : null}
          {data.contact.linkedin ? <Text style={styles.contactItem}>{data.contact.linkedin}</Text> : null}
          {data.contact.portfolio ? <Text style={styles.contactItem}>{data.contact.portfolio}</Text> : null}
        </View>

        {/* ── Summary ── */}
        {data.summary ? (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.bodyText}>{data.summary}</Text>
          </View>
        ) : null}

        {/* ── Experience ── */}
        {data.experience.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.entryWrap}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{exp.title}</Text>
                  <Text style={styles.meta}>{exp.duration}</Text>
                </View>
                <Text style={styles.meta}>{exp.company}</Text>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Skills ── */}
        {data.skills.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsWrap}>
              {data.skills.map((s, i) => (
                <Text key={i} style={styles.skillItem}>
                  {s}{i < data.skills.length - 1 ? '  ·' : ''}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* ── Education ── */}
        {data.education.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.entryWrap}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{edu.degree}</Text>
                  <Text style={styles.meta}>{edu.year}</Text>
                </View>
                <Text style={styles.meta}>
                  {edu.institution}{edu.grade ? `  ·  ${edu.grade}` : ''}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Projects ── */}
        {data.projects.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((p, i) => (
              <View key={i} style={styles.entryWrap}>
                <Text style={styles.bold}>
                  {p.name}{p.link ? `  —  ${p.link}` : ''}
                </Text>
                <Text style={styles.bodyText}>{p.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Certifications ── */}
        {data.certifications.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((c, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Achievements ── */}
        {data.achievements.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {data.achievements.map((a, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{a}</Text>
              </View>
            ))}
          </View>
        ) : null}

      </Page>
    </Document>
  )
}
