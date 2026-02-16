import { Request, Response } from 'express';
import { PrismaClient,Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();


export const createUserController = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password y nombre son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as Role 
      }
    });

    res.status(201).json({ 
      message: `Usuario ${user.role} creado con éxito`, 
      id: user.id 
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "El email ya está registrado o hubo un error de validación" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("Usuario no encontrado en AWS");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '30m' }
    );

    return res.json({
      message: "Login exitoso",
      token: token,
      userId: user.id,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  console.log("Obteniendo todos los usuarios");
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      },
    });
    console.log("Usuarios obtenidos:", users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string; 

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    res.json({ message: "Usuario y toda su información relacionada eliminada" });
  } catch (error: any) {
    console.error("Error al borrar:", error);
    res.status(500).json({ error: "No se pudo eliminar el usuario", details: error.message });
  }
};

