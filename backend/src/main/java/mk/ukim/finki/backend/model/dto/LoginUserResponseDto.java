package mk.ukim.finki.backend.model.dto;

import mk.ukim.finki.backend.model.enums.Role;

public record LoginUserResponseDto(
        String token,
        Role role
) {
}

