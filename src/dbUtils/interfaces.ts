import type { DocumentType } from "@typegoose/typegoose/lib/types";

export type SubModel<TBase, TFields extends keyof TBase> = Omit<
  DocumentType<TBase>,
  keyof Omit<TBase, TFields>
>;
