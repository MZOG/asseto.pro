import { serviceTypeConfig } from "@/lib/utils/service";

interface Service {
  id: string;
  serviced_at: string;
  next_service_at: string | null;
  type: string;
  performed_by: string | null;
  notes: string | null;
  cost: number | null;
}

export default function ServiceHistory({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <p className="text-sm text-gray-400">Brak wpisów serwisowych.</p>;
  }

  return (
    <div className="space-y-3">
      {services.map((service) => {
        const config =
          serviceTypeConfig[service.type as keyof typeof serviceTypeConfig] ??
          serviceTypeConfig.inspection;
        const Icon = config.icon;
        const date = new Date(service.serviced_at).toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const nextDate = service.next_service_at
          ? new Date(service.next_service_at).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : null;

        return (
          <div
            key={service.id}
            className="border border-gray-200 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}
              >
                <Icon size={11} />
                {config.label}
              </span>
              <span className="text-xs text-gray-500">{date}</span>
            </div>

            {service.performed_by && (
              <p className="text-xs text-gray-500">
                Wykonał:{" "}
                <span className="font-medium text-gray-700">
                  {service.performed_by}
                </span>
              </p>
            )}
            {service.cost && (
              <p className="text-xs text-gray-500">
                Koszt:{" "}
                <span className="font-medium text-gray-700">
                  {service.cost.toLocaleString("pl-PL")} zł
                </span>
              </p>
            )}
            {nextDate && (
              <p className="text-xs text-gray-500">
                Następny serwis:{" "}
                <span className="font-medium text-blue-600">{nextDate}</span>
              </p>
            )}
            {service.notes && (
              <p className="text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-2 mt-2">
                {service.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
