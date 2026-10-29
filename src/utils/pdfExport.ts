import { CVData } from '../types/cv';

function formatDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1] || ''} ${y}`;
}

export async function exportToPDF(data: CVData): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  const accent =
    data.accentColor === 'violet' ? [139, 92, 246] :
    data.accentColor === 'cyan' ? [6, 182, 212] :
    [59, 130, 246];

  // Background
  doc.setFillColor(10, 10, 20);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Header stripe
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, 0, 5, pageH, 'F');

  // Helper: check page
  function checkPage(needed: number) {
    if (y + needed > pageH - margin) {
      doc.addPage();
      doc.setFillColor(10, 10, 20);
      doc.rect(0, 0, pageW, pageH, 'F');
      doc.setFillColor(accent[0], accent[1], accent[2]);
      doc.rect(0, 0, 5, pageH, 'F');
      y = margin;
    }
  }

  // Name
  y = 20;
  if (data.profile.name) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text(data.profile.name, margin, y);
    y += 9;
  }

  if (data.profile.title) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(data.profile.title, margin, y);
    y += 6;
  }

  if (data.profile.specialty) {
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 200);
    doc.text(data.profile.specialty, margin, y);
    y += 5;
  }

  // Contact line
  const contacts: string[] = [];
  if (data.profile.email) contacts.push(data.profile.email);
  if (data.profile.phone) contacts.push(data.profile.phone);
  if (data.profile.city || data.profile.country)
    contacts.push([data.profile.city, data.profile.country].filter(Boolean).join(', '));
  if (contacts.length) {
    doc.setFontSize(9);
    doc.setTextColor(140, 160, 200);
    doc.text(contacts.join('  |  '), margin, y);
    y += 5;
  }

  const links: string[] = [];
  if (data.profile.linkedin) links.push(`LinkedIn: ${data.profile.linkedin}`);
  if (data.profile.github) links.push(`GitHub: ${data.profile.github}`);
  if (data.profile.portfolio) links.push(`Portfolio: ${data.profile.portfolio}`);
  if (links.length) {
    doc.setFontSize(8);
    doc.setTextColor(100, 140, 200);
    doc.text(links.join('   '), margin, y);
    y += 5;
  }

  // Divider
  y += 3;
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  function sectionTitle(title: string) {
    checkPage(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageW - margin, y);
    y += 5;
  }

  function bodyText(text: string, indent = 0, color: [number, number, number] = [210, 215, 235]) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentW - indent);
    checkPage(lines.length * 4 + 2);
    doc.text(lines, margin + indent, y);
    y += lines.length * 4 + 1;
  }

  // About
  if (data.visibleSections.about && data.about.content) {
    sectionTitle(data.sectionTitles.about);
    bodyText(data.about.content);
    y += 4;
  }

  // Experience
  if (data.visibleSections.experience && data.experience.length > 0) {
    sectionTitle(data.sectionTitles.experience);
    for (const exp of data.experience) {
      checkPage(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(exp.position || '', margin, y);

      const dateStr = [formatDate(exp.startDate), exp.isCurrent ? 'Presente' : formatDate(exp.endDate)].filter(Boolean).join(' – ');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 170, 200);
      if (dateStr) doc.text(dateStr, pageW - margin, y, { align: 'right' });
      y += 4;

      if (exp.company) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(accent[0], accent[1], accent[2]);
        doc.text([exp.company, exp.location].filter(Boolean).join(' · '), margin, y);
        y += 4;
      }
      if (exp.description) bodyText(exp.description, 2);
      if (exp.achievements) bodyText(`Logros: ${exp.achievements}`, 2, [180, 220, 180]);
      y += 3;
    }
    y += 2;
  }

  // Education
  if (data.visibleSections.education && data.education.length > 0) {
    sectionTitle(data.sectionTitles.education);
    for (const edu of data.education) {
      checkPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(edu.degree || '', margin, y);

      const dateStr = [formatDate(edu.startDate), formatDate(edu.endDate)].filter(Boolean).join(' – ');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 170, 200);
      if (dateStr) doc.text(dateStr, pageW - margin, y, { align: 'right' });
      y += 4;

      if (edu.institution) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(accent[0], accent[1], accent[2]);
        doc.text(edu.institution, margin, y);
        y += 4;
      }
      if (edu.description) bodyText(edu.description, 2);
      y += 3;
    }
    y += 2;
  }

  // Skills
  if (data.visibleSections.skills && data.skills.length > 0) {
    sectionTitle(data.sectionTitles.skills);
    const techSkills = data.skills.filter(s => s.category === 'technical');
    const softSkills = data.skills.filter(s => s.category === 'soft');
    if (techSkills.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(accent[0], accent[1], accent[2]);
      doc.text('Técnicas:', margin, y);
      y += 4;
      bodyText(techSkills.map(s => s.level ? `${s.name} (${s.level})` : s.name).join(' · '), 2);
    }
    if (softSkills.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(accent[0], accent[1], accent[2]);
      doc.text('Personales:', margin, y);
      y += 4;
      bodyText(softSkills.map(s => s.name).join(' · '), 2);
    }
    y += 4;
  }

  // Projects
  if (data.visibleSections.projects && data.projects.length > 0) {
    sectionTitle(data.sectionTitles.projects);
    for (const proj of data.projects) {
      checkPage(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(proj.name || '', margin, y);
      y += 4;
      if (proj.technologies) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(accent[0], accent[1], accent[2]);
        doc.text(proj.technologies, margin, y);
        y += 4;
      }
      if (proj.description) bodyText(proj.description, 2);
      if (proj.projectUrl) bodyText(`URL: ${proj.projectUrl}`, 2, [100, 150, 220]);
      y += 3;
    }
    y += 2;
  }

  // Certifications
  if (data.visibleSections.certifications && data.certifications.length > 0) {
    sectionTitle(data.sectionTitles.certifications);
    for (const cert of data.certifications) {
      checkPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(cert.name || '', margin, y);
      const dateStr = formatDate(cert.date);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 170, 200);
      if (dateStr) doc.text(dateStr, pageW - margin, y, { align: 'right' });
      y += 4;
      if (cert.issuer) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(accent[0], accent[1], accent[2]);
        doc.text(cert.issuer, margin, y);
        y += 4;
      }
      if (cert.description) bodyText(cert.description, 2);
      y += 3;
    }
    y += 2;
  }

  // Languages
  if (data.visibleSections.languages && data.languages.length > 0) {
    sectionTitle(data.sectionTitles.languages);
    const langText = data.languages.map(l => `${l.language}${l.level ? ` (${l.level})` : ''}`).join('  ·  ');
    bodyText(langText);
    y += 4;
  }

  // Additional
  if (data.visibleSections.additional && data.additional.length > 0) {
    sectionTitle(data.sectionTitles.additional);
    for (const item of data.additional) {
      checkPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`[${item.category || 'Otro'}] ${item.title || ''}`, margin, y);
      if (item.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(160, 170, 200);
        doc.text(formatDate(item.date), pageW - margin, y, { align: 'right' });
      }
      y += 4;
      if (item.description) bodyText(item.description, 2);
      y += 3;
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(80, 90, 120);
    doc.text(`Neural CV  ·  Página ${i} de ${totalPages}`, pageW / 2, pageH - 8, { align: 'center' });
  }

  const filename = data.profile.name
    ? `CV-${data.profile.name.replace(/\s+/g, '-')}.pdf`
    : 'CV.pdf';
  doc.save(filename);
}
