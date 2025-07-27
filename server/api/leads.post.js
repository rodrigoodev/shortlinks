import { turso } from "../helper/turso.js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, celular, source } = body;

    // Validações básicas
    if (!email && !celular) {
      return {
        success: false,
        message: "Email ou celular é obrigatório",
      };
    }

    // Inserir lead
    const result = await turso.execute({
      sql: "INSERT INTO leads (email, celular, source) VALUES (?, ?, ?)",
      args: [email || null, celular || null, source || 'footer'],
    });

    return {
      success: true,
      message: "Lead registrado com sucesso! Entraremos em contato em breve!",
      id: Number(result.lastInsertRowid),
      urgency: true
    };

    return {
      success: true,
      message: "Lead registrado com sucesso! Entraremos em contato em breve!",
      id: Number(result.lastInsertRowid),
      urgency: true
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao registrar lead: " + error.message,
    };
  }
}); 