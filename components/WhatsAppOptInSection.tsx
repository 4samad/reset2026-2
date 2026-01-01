interface WhatsAppOptInSectionProps {
  whatsappOptIn: boolean;
  onWhatsappOptInChange: (checked: boolean) => void;
  mentorCheckInOptIn: boolean;
  onMentorCheckInOptInChange: (checked: boolean) => void;
  whatsappNumber: string;
  onWhatsappNumberChange: (number: string) => void;
}

export default function WhatsAppOptInSection({
  whatsappOptIn,
  onWhatsappOptInChange,
  mentorCheckInOptIn,
  onMentorCheckInOptInChange,
  whatsappNumber,
  onWhatsappNumberChange,
}: WhatsAppOptInSectionProps) {
  return (
    <div className="space-y-4">
      <div className="form-control bg-success/5 p-4 rounded-2xl">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            checked={whatsappOptIn}
            onChange={(e) => onWhatsappOptInChange(e.target.checked)}
            className="checkbox checkbox-primary checkbox-lg"
          />
          <div>
            <div className="font-bold">Daily WhatsApp messages 📱</div>
            <div className="text-sm text-base-content/70 font-medium">
              Get gentle daily reminders
            </div>
          </div>
        </label>
      </div>

      <div className="form-control bg-info/5 p-4 rounded-2xl">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            checked={mentorCheckInOptIn}
            onChange={(e) => onMentorCheckInOptInChange(e.target.checked)}
            className="checkbox checkbox-primary checkbox-lg"
          />
          <div>
            <div className="font-bold">Weekly mentor check-in 🤝</div>
            <div className="text-sm text-base-content/70 font-medium">
              One-on-one support via WhatsApp
            </div>
          </div>
        </label>
      </div>

      {(whatsappOptIn || mentorCheckInOptIn) && (
        <div className="form-control animate-fade-in">
          <label className="label">
            <span className="label-text font-bold">WhatsApp Number</span>
          </label>
          <input
            type="tel"
            value={whatsappNumber}
            onChange={(e) => onWhatsappNumberChange(e.target.value)}
            className="input input-bordered w-full rounded-2xl border-2 focus:border-primary focus:ring-4 focus:ring-primary/20 font-semibold"
            placeholder="WhatsApp number with country code (e.g., +919605565175)"
            required
          />
        </div>
      )}
    </div>
  );
}
