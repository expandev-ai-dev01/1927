import { z } from 'zod';

export const searchTermSchema = z
  .string('Digite um termo de busca')
  .min(2, 'Digite pelo menos 2 caracteres para realizar a busca')
  .max(100, 'O termo de busca não pode exceder 100 caracteres');

export const productCodeSchema = z
  .string('Digite um código de produto')
  .regex(/^LZ-\d{4}$/i, 'Formato de código inválido. Use o formato LZ-XXXX');

export const priceRangeSchema = z
  .object({
    minimo: z.number().min(0, 'O valor mínimo deve ser maior ou igual a zero').nullable(),
    maximo: z.number().nullable(),
  })
  .refine(
    (data) => {
      if (data.minimo !== null && data.maximo !== null) {
        return data.maximo > data.minimo;
      }
      return true;
    },
    {
      message: 'O valor máximo deve ser maior que o valor mínimo',
      path: ['maximo'],
    }
  );

export const dimensionRangeSchema = z
  .object({
    minimo: z.number().min(0).nullable(),
    maximo: z.number().nullable(),
  })
  .refine(
    (data) => {
      if (data.minimo !== null && data.maximo !== null) {
        return data.maximo > data.minimo;
      }
      return true;
    },
    {
      message: 'O valor máximo deve ser maior que o valor mínimo',
      path: ['maximo'],
    }
  );

export const searchFiltersSchema = z.object({
  categoria: z.array(z.string()).optional(),
  faixa_preco: priceRangeSchema.optional(),
  material: z.array(z.string()).optional(),
  cor: z.array(z.string()).optional(),
  estilo: z.array(z.string()).optional(),
  dimensoes: z
    .object({
      altura: dimensionRangeSchema.optional(),
      largura: dimensionRangeSchema.optional(),
      profundidade: dimensionRangeSchema.optional(),
    })
    .optional(),
});

export const searchParamsSchema = z.object({
  termo_busca: searchTermSchema.optional(),
  codigo_produto: productCodeSchema.optional(),
  filtros: searchFiltersSchema.optional(),
  ordenacao: z
    .enum(['relevancia', 'nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc'])
    .default('relevancia'),
  pagina_atual: z.number().int().min(1, 'Número de página inválido').default(1),
  itens_por_pagina: z.enum([12, 24, 36, 48]).default(24),
});

export const favoritNameSchema = z
  .string('Digite um nome para a busca favorita')
  .min(3, 'O nome deve ter pelo menos 3 caracteres')
  .max(50, 'O nome não pode exceder 50 caracteres');
