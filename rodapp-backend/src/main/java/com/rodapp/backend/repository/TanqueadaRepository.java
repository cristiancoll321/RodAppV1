package com.rodapp.backend.repository;

import com.rodapp.backend.model.Tanqueada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TanqueadaRepository extends JpaRepository<Tanqueada, Long> {
    List<Tanqueada> findByMotocicletaId(Long motocicletaId);
}
