import { AuditRecordSchema } from "beast-contracts/data";
import { publishEvent } from "../data/EventPublisher";

export class AuditStore {
  constructor() {
    this.ledger = new Map(); // auditId → auditRecord
  }

  write(auditRecord) {
    const valid = AuditRecordSchema.safeParse(auditRecord);
    if (!valid.success) throw new Error("Invalid audit record");

    this.ledger.set(auditRecord.id, auditRecord);

    publishEvent("data.audit.written", {
      id: auditRecord.id,
      recordedAt: auditRecord.recordedAt
    });

    return auditRecord;
  }

  read(auditId) {
    return this.ledger.get(auditId) || null;
  }

  list() {
    return Array.from(this.ledger.values());
  }
}
