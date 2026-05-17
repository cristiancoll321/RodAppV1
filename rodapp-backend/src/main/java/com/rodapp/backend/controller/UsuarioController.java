package com.rodapp.backend.controller;


import com.rodapp.backend.dto.LoginRequestDTO;
import com.rodapp.backend.dto.RegistroRequestDTO;
import com.rodapp.backend.dto.UsuarioResponseDTO;
import com.rodapp.backend.model.Usuario;
import com.rodapp.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponseDTO> registrar(@RequestBody RegistroRequestDTO registroDTO){
        Usuario usuario = usuarioService.registrar(registroDTO);
        UsuarioResponseDTO response = new UsuarioResponseDTO(usuario);
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody LoginRequestDTO loginDTO){
        Usuario usuario = usuarioService.login(loginDTO);
        UsuarioResponseDTO response = new UsuarioResponseDTO(usuario);
        return ResponseEntity.ok(response);
    }

    /*@GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable Long id){
        Usuario usuario = usuarioService.
    }*/
}
