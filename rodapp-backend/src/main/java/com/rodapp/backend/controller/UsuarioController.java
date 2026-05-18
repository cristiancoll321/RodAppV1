package com.rodapp.backend.controller;


import com.rodapp.backend.dto.LoginRequestDTO;
import com.rodapp.backend.dto.RegistroRequestDTO;
import com.rodapp.backend.dto.UsuarioResponseDTO;
import com.rodapp.backend.model.Usuario;
import com.rodapp.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    //POST /api/usuarios/registrar
    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponseDTO> registrar(@RequestBody RegistroRequestDTO registroDTO){
        Usuario usuario = usuarioService.registrar(registroDTO);
        UsuarioResponseDTO response = new UsuarioResponseDTO(usuario);
        return ResponseEntity.status(201).body(response);
    }

    //POST /api/usuarios/login
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody LoginRequestDTO loginDTO){
        Usuario usuario = usuarioService.login(loginDTO);
        UsuarioResponseDTO response = new UsuarioResponseDTO(usuario);
        return ResponseEntity.ok(response);
    }

    //GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable Long id){
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
    }

    //GET de todos los usuarios
    @GetMapping
    public List<Usuario> getUsuarios(){
        return this.usuarioService.getUsuarios();
    }

    //PUT /api/usuarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody RegistroRequestDTO datosActualizados){
        Usuario usuario = usuarioService.actualizar(id, datosActualizados);
        return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
    }

    //DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id){
        usuarioService.eliminar(id);
        return ResponseEntity.ok("Usuario eliminando correctamente");
    }
}
