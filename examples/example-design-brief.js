/**
 * Use DeepSeek to generate design briefs and recommendations
 * 
 * Usage:
 *   npm install
 *   node examples/example-design-brief.js
 */

const client = require('../lib/openrouter-client');

async function generateDesignBrief() {
  try {
    console.log('🎨 Design Brief Generator with DeepSeek\n');
    
    const systemPrompt = `You are an expert design strategist. You help designers create compelling visual concepts.
    When given a product or project, you:
    1. Analyze the core value proposition
    2. Suggest 3 distinct visual directions
    3. Recommend color palettes for each direction
    4. List key design principles to follow`;

    const userBrief = `I'm designing a launch animation for a new AI coding assistant called "Nexus".
    
    Key info:
    - Target audience: Developers and tech enthusiasts
    - Tone: Modern, powerful, approachable
    - Platform: Web and desktop
    - Duration: 15-30 seconds
    
    What visual directions would you recommend?`;

    console.log('📋 Design Brief:\n');
    console.log(userBrief);
    console.log('\n' + '='.repeat(60) + '\n');

    console.log('🤔 DeepSeek is analyzing...\n');

    const response = await client.chat({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userBrief
        }
      ],
      max_tokens: 2000,
      temperature: 0.8  // Slightly higher for more creative suggestions
    });

    console.log('✨ Design Recommendations:\n');
    console.log(response);
    console.log('\n' + '='.repeat(60) + '\n');

    // Generate color palettes for the directions
    console.log('🎨 Generating color palettes...\n');

    const colorRequest = `Based on the design directions above, create detailed color palettes.
    For each direction, provide:
    - Primary color (HEX)
    - Secondary color (HEX)
    - Accent color (HEX)
    - Background color (HEX)
    
    Format as:
    Direction 1:
    Primary: #XXXXXX
    Secondary: #XXXXXX
    etc.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userBrief
      },
      {
        role: 'assistant',
        content: response
      },
      {
        role: 'user',
        content: colorRequest
      }
    ];

    const colorPalettes = await client.chat({
      messages,
      max_tokens: 1500,
      temperature: 0.7
    });

    console.log('🎯 Color Palettes:\n');
    console.log(colorPalettes);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateDesignBrief();
