package com.rodapp.backend.service;

import com.rodapp.backend.dto.LoginRequestDTO;
import com.rodapp.backend.dto.RegistroRequestDTO;
import com.rodapp.backend.model.Usuario;
import com.rodapp.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; //Inyectamos el encoder

    //Obtine a todos los usuarios
    public List<Usuario> getUsuarios(){
        return this.usuarioRepository.findAll();
    }

    //Registro: Recibe contraseña plana, guarda hash
    public Usuario registrar(RegistroRequestDTO registroDTO) {
        try {
            System.out.println("=== INTENTANDO REGISTRAR ===");
            System.out.println("Nombre: " + registroDTO.getNombre());
            System.out.println("Email: " + registroDTO.getEmail());

            String passwordHash = passwordEncoder.encode(registroDTO.getPassword());
            System.out.println("Password hash generado");

            Usuario usuario = new Usuario();
            usuario.setNombre(registroDTO.getNombre());
            usuario.setEmail(registroDTO.getEmail());
            usuario.setPasswordHash(passwordHash);
            usuario.setEstado(true);

            System.out.println("Usuario creado, guardando en BD...");
            Usuario saved = usuarioRepository.save(usuario);
            System.out.println("Guardado exitoso! ID: " + saved.getId());

            return saved;

        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace();  // ← Esto imprimirá el error completo
            throw e;
        }
    }


    //LOGIN:Verifica si la contraseña plana coincide con el hash
    public Usuario login(LoginRequestDTO loginDTO){
        //Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(()-> new RuntimeException("Email o contrasenia incorrectos"));

        //verifica si el usuario esta activo
        if(!usuario.getEstado()){
            throw new RuntimeException("Usuario Desactivado");
        }

        //Verificar: Compara la contrasenia plana con el hash almacenado
        boolean passwordMatches = passwordEncoder.matches(
                loginDTO.getPassword(),  //Contrasenia plana que ingresa el usuario
                usuario.getPasswordHash() //Hash almacenado en BD
        );

        if(!passwordMatches){
            throw new RuntimeException("Email o Contrasenia incorrectos");
        }

        return usuario;
    }

    //Bucar por Id
    public Usuario buscarPorId (Long id){
        return usuarioRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
    }

    //Actualizar
    public Usuario actualizar(Long id, RegistroRequestDTO dto){
        Usuario usuario = buscarPorId(id);
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        return usuarioRepository.save(usuario);
    }

    //Eliminar
    public Usuario eliminar (Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
        return usuario;
    }
}
