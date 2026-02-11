import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  equipment: defineTable({
    name: v.string(),
    identifier: v.string(), // np. "Bieżnia-01"
    qrCodeId: v.string(),
    ownerId: v.string(), // Tutaj zapiszemy userId z Clerka
  }).index('by_owner', ['ownerId']),

  // Tabela usterki (zgłaszana publicznie)
  issues: defineTable({
    equipmentId: v.id('equipment'),
    description: v.string(),
    status: v.string(), // "pending" | "in_progress" | "fixed"
    createdAt: v.number(),
  }),
})
