package com.example.backend.security;

import com.example.backend.service.CustomerUserDetailsService;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepo;
    private final CustomerUserDetailsService userDetailsService; // new

    @Override

    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res,
            FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("🔥 USING UPDATED FILTER 🔥");

        System.out.println(">>> JwtAuthenticationFilter triggered");

        String authHeader = req.getHeader("Authorization");
        System.out.println("RAW HEADER = " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(req, res);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("TOKEN = " + token);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            System.out.println("🔥 JWT ERROR: " + e.getMessage());
            e.printStackTrace(); // TEMP
            filterChain.doFilter(req, res);
            return;
        }

        String role = jwtService.extractRole(token);
        System.out.println("JWT username = " + username);
        System.out.println("JWT role = " + role);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // load UserDetails via your service — ensures authorities match your
            // UserDetailsService
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails != null) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);

                // convenience: attach the user entity to request if you still want it
                var userEntity = userRepo.findByUsername(username).orElse(null);
                if (userEntity != null) {
                    req.setAttribute("user", userEntity);
                }
                System.out.println("Authentication set for user: " + username);
                System.out.println("🔑 Authorities: " + userDetails.getAuthorities());
            }
        }

        filterChain.doFilter(req, res);
    }
}
