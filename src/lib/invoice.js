import { money } from "./constants";

// Optional requirement: downloadable PDF receipt for confirmed bookings
export async function downloadInvoice(b) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const left = 20;
  let y = 24;
  const line = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90);
    doc.text(label, left, y);
    doc.setTextColor(20);
    doc.text(String(value), 190, y, { align: "right" });
    y += 9;
  };

  doc.setFillColor(11, 122, 117);
  doc.rect(0, 0, 210, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text("StudioSpace", left, y);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Booking invoice", 190, y, { align: "right" });
  y += 14;
  doc.setDrawColor(200);
  doc.line(left, y - 6, 190, y - 6);

  doc.setFontSize(11);
  line("Invoice no.", `SS-${String(b._id).slice(-8).toUpperCase()}`);
  line("Issued", new Date().toLocaleDateString("en-GB"));
  line("Status", b.status);
  y += 4;
  line("Studio", b.studioTitle);
  line("Location", b.studioLocation);
  line("Booked by", b.userName);
  line("Email", b.userEmail);
  y += 4;
  line("Date", b.date);
  line("Time", `${b.startTime} - ${b.endTime} (${b.hours} h)`);
  line("Guests", b.guests);
  y += 4;
  line("Hourly rate", `${money(b.hourlyRate)} x ${b.hours} h`);
  line("Studio subtotal", money(b.subtotal));
  line("Security deposit (refundable)", money(b.securityDeposit));
  doc.line(left, y - 4, 190, y - 4);
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total", left, y);
  doc.text(money(b.total), 190, y, { align: "right" });
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text("Thank you for booking with StudioSpace. The security deposit is returned after your session if the space is left as found.", left, y, { maxWidth: 170 });

  doc.save(`StudioSpace-Invoice-${String(b._id).slice(-8)}.pdf`);
}
