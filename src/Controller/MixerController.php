<?php
/**
 * @file
 * Contains \Drupal\hip_mixer\Controller\MixerController.
 */
namespace Drupal\hip_mixer\Controller;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MixerController extends ControllerBase {
    protected $twig;
    const allowed_tags = [
        'script', 'div', 'table', 'tr', 'td', 'th', 'i', 'link', 'p',
        'h1', 'h2', 'h3', 'a', 'img', 'details', 'summary', 'ul', 'li',
        'input', 'svg', 'use'
    ];

    // this is called first then call constructor 
    public static function create(ContainerInterface $container) {
        return new static(
            $container->get('twig') ,
        );
    }

    public function __construct(\Twig_Environment $twig) {
        $this->twig = $twig ;
    }
    
    public function play() {
        $tpl_path = drupal_get_path('module', 'hip_mixer') . '/templates/play-template.html.twig';
        $template = $this->twig->loadTemplate($tpl_path);
        $markup = [
            '#markup' => $template->render([]),
            '#allowed_tags' => self::allowed_tags
        ];
        return $markup;
    }
}
