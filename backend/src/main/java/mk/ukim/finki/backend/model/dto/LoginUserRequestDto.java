package mk.ukim.finki.backend.model.dto;

public record LoginUserRequestDto(
        String username,
        String password
) {
}
