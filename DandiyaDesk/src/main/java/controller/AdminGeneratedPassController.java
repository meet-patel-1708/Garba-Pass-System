package controller;

import model.GeneratedPass;
import model.Pass;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.GeneratedPassService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/generated")
@CrossOrigin(origins = "*") // Enable CORS for Angular frontend
public class AdminGeneratedPassController {
    private final GeneratedPassService genService;

    public AdminGeneratedPassController(GeneratedPassService genService) {
        this.genService = genService;
    }

    /**
     * Generate bulk passes for an organizer
     * POST /api/admin/generated/generate?organizerAdharCard=123456789012&count=10&price=500&prefix=GARBA
     */
    @PostMapping("/generate")
    public ResponseEntity<List<GeneratedPass>> generate(
            @RequestParam Long organizerAdharCard,
            @RequestParam int count,
            @RequestParam BigDecimal price,
            @RequestParam(required = false, defaultValue = "GARBA") String prefix
    ) {
        System.out.println("Generating " + count + " passes for organizer: " + organizerAdharCard);
        List<GeneratedPass> list = genService.generateBulk(organizerAdharCard, count, price, prefix);
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ FIXED: Get available passes for specific organizer
     * GET /api/admin/generated/available/123456789012
     *
     * ISSUE: Parameter name was 'organizerId' but path variable was 'organizerAdharCard'
     * FIX: Changed parameter to match path variable name
     */
    @GetMapping("/available/{organizerAdharCard}")
    public ResponseEntity<List<GeneratedPass>> available(
            @PathVariable("organizerAdharCard") Long organizerAdharCard
    ) {
        System.out.println("✅ Fetching available passes for organizer: " + organizerAdharCard);
        List<GeneratedPass> passes = genService.listAvailable(organizerAdharCard);
        System.out.println("✅ Found " + passes.size() + " available passes");
        return ResponseEntity.ok(passes);
    }

    /**
     * Sell a pass to a buyer
     * POST /api/admin/generated/sell/GARBA-123456?buyerId=987654321012
     */
    @PostMapping("/sell/{serial}")
    public ResponseEntity<Pass> sell(
            @PathVariable String serial,
            @RequestParam Long buyerId
    ) {
        System.out.println("Selling pass " + serial + " to buyer " + buyerId);
        Pass issued = genService.sellGeneratedPassToUser(serial, buyerId);
        System.out.println("✅ Pass sold successfully!");
        return ResponseEntity.ok(issued);
    }

    /**
     * Get total passes count for organizer
     * GET /api/admin/generated/total_pass/123456789012
     */
    @GetMapping("/total_pass/{organizerAdharCard}")
    public ResponseEntity<Long> total_passes(
            @PathVariable("organizerAdharCard") Long organizerAdharCard
    ) {
        System.out.println("Received request for organizerAdharCard: " + organizerAdharCard);
        Long count = genService.getTotalPass(organizerAdharCard);
        System.out.println("Total passes: " + count);
        return ResponseEntity.ok(count);
    }

    /**
     * Get total sold passes count for organizer
     * GET /api/admin/generated/total_sold_pass/123456789012
     */
    @GetMapping("/total_sold_pass/{organizerAdharCard}")
    public ResponseEntity<Long> total_sold_pass(
            @PathVariable("organizerAdharCard") Long organizerAdharCard
    ) {
        System.out.println("Received request for organizer adhar card: " + organizerAdharCard);
        Long count = genService.getTotalSoldPass(organizerAdharCard);
        System.out.println("Total sold passes: " + count);
        return ResponseEntity.ok(count);
    }

    /**
     * ✅ FIXED: Get pass by serial number
     * GET /api/admin/generated/getPass/GARBA-123456
     *
     * ISSUE: Return type was String but service returns Optional<GeneratedPass>
     * FIX: Changed to return GeneratedPass with proper 404 handling
     */
    @GetMapping("/getPass/{serialNumber}")
    public ResponseEntity<GeneratedPass> getPassBySerial(
            @PathVariable String serialNumber
    ) {
        System.out.println("Fetching pass with serial: " + serialNumber);
        return genService.getPassBySerial(serialNumber)
                .map(pass -> {
                    System.out.println("✅ Pass found: " + pass.getSerialNumber());
                    return ResponseEntity.ok(pass);
                })
                .orElseGet(() -> {
                    System.out.println("❌ Pass not found with serial: " + serialNumber);
                    return ResponseEntity.notFound().build();
                });
    }
}