package com.rodapp.backend.repository;

import com.rodapp.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar por email (para login)
    Optional<Usuario> findByEmail(String email);

    // Verificar si existe un email (para registro)
    boolean existsByEmail(String email);
}
