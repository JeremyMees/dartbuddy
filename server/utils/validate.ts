export function removeEmptyValues(obj: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}

  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      updateData[key] = obj[key]
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid fields to update',
    })
  }

  return updateData
}
