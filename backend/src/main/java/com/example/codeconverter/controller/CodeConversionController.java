package com.example.codeconverter.controller;

import org.springframework.ai.mistralai.MistralAiChatModel;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("*")
public class CodeConversionController {

    private final MistralAiChatModel codeConverter;

    public CodeConversionController(MistralAiChatModel codeConverter) {
        this.codeConverter = codeConverter;
    }

    @PostMapping("/convert")
    public String convertCode(@RequestBody Map<String, String> request) {
        String sourceCode = request.get("sourceCode");
        String targetLanguage = request.get("targetLanguage");

        // Validate input
        if (sourceCode == null || sourceCode.trim().isEmpty()) {
            return "Error: Source code cannot be empty";
        }
        if (targetLanguage == null || targetLanguage.trim().isEmpty()) {
            return "Error: Target language must be specified";
        }

        String promptText = "Translate the following code snippet to " + targetLanguage +
                ". Provide only the raw code as the output, with no additional text, explanations, or markdown formatting. Here is the code:\n\n" + sourceCode;

        try {
            UserMessage userMessage = new UserMessage(promptText);
            Prompt prompt = new Prompt(userMessage);

            var response = codeConverter.call(prompt);

            // Check if response is valid
            if (response == null || response.getResult() == null) {
                return "Error: No response received from Mistral AI";
            }

            String content = response.getResult().getOutput().getText();
            if (content == null || content.trim().isEmpty()) {
                return "Error: Empty response from Mistral AI";
            }

            return content;

        } catch (org.springframework.ai.retry.NonTransientAiException e) {
            return "Error: Authentication failed - please check API key: " + e.getMessage();
        }
         catch (Exception e) {
            System.err.println("Unexpected error in code conversion: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            return "Error: Unable to convert code - " + e.getClass().getSimpleName() + ": " + e.getMessage();
        }
    }
}