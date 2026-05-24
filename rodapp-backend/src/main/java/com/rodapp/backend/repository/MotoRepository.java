package com.rodapp.backend.repository;

import com.rodapp.backend.model.Motocicleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MotoRepository extends JpaRepository<Motocicleta, Long> {
    List<Motocicleta> findByUsuarioId(Long UsuarioId);


}
