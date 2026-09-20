import { z } from 'zod';

/**
 * Every number on the site must pass through this schema.
 * A figure without a `source` and `verifiedOn` date cannot be built.
 *
 * `status` tells the templates how to render the number:
 *   - "verified"  : documented by a primary record (statement, award letter, official page)
 *   - "stated"    : the author's own account, no document (rendered with "as I recall")
 *   - "estimate"  : derived from a stated rate (rendered with "≈" and the method)
 *   - "todo"      : not yet known — rendered as a visible TODO, never as a number
 */
export const Status = z.enum(['verified', 'stated', 'estimate', 'todo']);
export type Status = z.infer<typeof Status>;

export const Fact = z.object({
  id: z.string(),
  label: z.string(),
  amountUSD: z.number().nullable(),
  status: Status,
  source: z.string().min(1),
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  method: z.string().optional(),
  note: z.string().optional(),
}).refine((f) => f.status === 'todo' || f.amountUSD !== null, {
  message: 'A fact that is not a TODO must carry an amount',
});
export type Fact = z.infer<typeof Fact>;

export const Payment = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  label: z.string(),
  amountUSD: z.number().nullable(),
  direction: z.enum(['out', 'in']),
  status: Status,
  source: z.string().min(1),
  note: z.string().optional(),
});
export type Payment = z.infer<typeof Payment>;

export const Deadline = z.object({
  id: z.string(),
  label: z.string(),
  date: z.string().nullable(),
  status: Status,
  source: z.string().min(1),
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional(),
});
export type Deadline = z.infer<typeof Deadline>;
