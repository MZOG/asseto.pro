// convex/actions.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// 1. PUBLICZNE: Zgłaszanie usterki (nie wymaga logowania)
export const reportPublicIssue = mutation({
  args: { equipmentId: v.id('equipment'), description: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('issues', {
      equipmentId: args.equipmentId,
      description: args.description,
      status: 'pending',
      createdAt: Date.now(),
    })
  },
})

// 2. PRYWATNE: Zarządzanie asortymentem (wymaga logowania)
export const addEquipment = mutation({
  args: { name: v.string(), identifier: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Nieautoryzowany dostęp')

    return await ctx.db.insert('equipment', {
      ...args,
      qrCodeId: crypto.randomUUID(),
      ownerId: identity.subject, // ID użytkownika z Clerk
    })
  },
})
