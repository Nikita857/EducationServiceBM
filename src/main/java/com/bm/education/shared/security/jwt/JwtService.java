package com.bm.education.shared.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Service for handling JSON Web Tokens (JWTs).
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long JWT_EXPIRATION; // Время жизни токена в миллисекундах

    /**
     * Extracts the username from a JWT.
     *
     * @param token The JWT to extract the username from.
     * @return The username.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts a claim from a JWT.
     *
     * @param token The JWT to extract the claim from.
     * @param claimsResolver A function to resolve the claim.
     * @param <T> The type of the claim.
     * @return The claim.
     */
    public <T> T extractClaim(String token, @NotNull Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a JWT.
     *
     * @param token The JWT to extract the claims from.
     * @return The claims.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Gets the signing key for the JWTs.
     *
     * @return The signing key.
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generates a JWT for a user.
     *
     * @param userDetails The details of the user to generate the JWT for.
     * @return The JWT.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(
//                В мап можно указать свой кастомный payload
                Map.of(
                        "role", userDetails.getAuthorities().toArray()[0].toString()
                ), userDetails);
    }

    /**
     * Generates a JWT for a user with extra claims.
     *
     * @param extraClaims The extra claims to add to the JWT.
     * @param userDetails The details of the user to generate the JWT for.
     * @return The JWT.
     */
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)) // Устанавливаем время жизни токена
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Checks if a JWT is valid.
     *
     * @param token The JWT to check.
     * @param userDetails The details of the user to check the JWT against.
     * @return true if the JWT is valid, false otherwise.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Checks if a JWT is expired.
     *
     * @param token The JWT to check.
     * @return true if the JWT is expired, false otherwise.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date from a JWT.
     *
     * @param token The JWT to extract the expiration date from.
     * @return The expiration date.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}