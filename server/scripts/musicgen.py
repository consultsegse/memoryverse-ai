#!/usr/bin/env python3
"""
MusicGen Service - Free music generation using Meta's MusicGen
Replaces paid Mubert API with open-source alternative
"""

import sys
import json
import os
from pathlib import Path

def generate_music(prompt: str, duration: int = 180, output_path: str = None):
    """
    Generate music using MusicGen
    
    Args:
        prompt: Text description of the music
        duration: Duration in seconds (default 180 = 3 minutes)
        output_path: Where to save the audio file
    
    Returns:
        dict with 'success', 'file_path', and 'duration'
    """
    try:
        # Import here to avoid loading model on script import
        from audiocraft.models import MusicGen
        from audiocraft.data.audio import audio_write
        import torch
        
        print(f"[MusicGen] Loading model...", file=sys.stderr)
        
        # Use 'small' model for faster generation and lower memory
        # Options: 'small' (300M), 'medium' (1.5B), 'large' (3.3B)
        model = MusicGen.get_pretrained('small')
        
        # Configure generation parameters
        model.set_generation_params(
            duration=duration,
            temperature=1.0,  # Creativity (0.0-2.0)
            top_k=250,        # Diversity
            top_p=0.0,        # Nucleus sampling
            cfg_coef=3.0      # Classifier-free guidance
        )
        
        print(f"[MusicGen] Generating music: '{prompt}' ({duration}s)", file=sys.stderr)
        
        # Generate music
        wav = model.generate([prompt])
        
        # Determine output path
        if output_path is None:
            timestamp = int(time.time())
            output_path = f"/tmp/musicgen_{timestamp}"
        else:
            # Remove extension if provided
            output_path = str(Path(output_path).with_suffix(''))
        
        # Save audio file
        print(f"[MusicGen] Saving to {output_path}.wav", file=sys.stderr)
        
        for idx, one_wav in enumerate(wav):
            audio_write(
                output_path,
                one_wav.cpu(),
                model.sample_rate,
                strategy="loudness",
                loudness_compressor=True
            )
        
        final_path = f"{output_path}.wav"
        
        print(f"[MusicGen] Music generated successfully!", file=sys.stderr)
        
        return {
            "success": True,
            "file_path": final_path,
            "duration": duration,
            "sample_rate": model.sample_rate
        }
        
    except Exception as e:
        print(f"[MusicGen] Error: {str(e)}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e)
        }

def main():
    """
    CLI interface for music generation
    Accepts JSON input via stdin
    """
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        prompt = input_data.get('prompt', 'emotional piano melody')
        duration = input_data.get('duration', 180)
        output_path = input_data.get('output_path')
        
        # Generate music
        result = generate_music(prompt, duration, output_path)
        
        # Output result as JSON
        print(json.dumps(result))
        
        # Exit with appropriate code
        sys.exit(0 if result['success'] else 1)
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
